#!/usr/bin/env bun
/**
 * article-to-markdown.ts
 *
 * This script is a command-line tool that downloads an HTML article from a given URL,
 * extracts its title and other available metadata (like author, publication date),
 * converts the main article content to Markdown using the Turndown library,
 * and saves the result to a Markdown file.
 *
 * How it works:
 * 1.  Shebang: Specifies that the script should be executed with Bun.
 * 2.  Imports: Necessary modules are imported:
 * - `fs/promises` for asynchronous file system operations (writing the output file).
 * - `parseArgs` from `util` for parsing command-line arguments.
 * - `TurndownService` from `turndown` to handle HTML to Markdown conversion.
 * - `JSDOM` from `jsdom` to parse the fetched HTML and enable DOM manipulation for metadata/content extraction.
 * 3.  Argument Parsing (`parseCliArguments`):
 * - Uses `util.parseArgs` to define and parse command-line arguments.
 * - Expects a mandatory `--url` argument specifying the article URL.
 * - Includes basic validation to ensure the URL is provided.
 * 4.  HTML Fetching (`fetchHtmlContent`):
 * - Takes a URL string.
 * - Uses the built-in `fetch` API (available globally in Bun) to retrieve the HTML content.
 * - Checks if the response is successful (status code 200).
 * - Returns the HTML content as text. Throws an error for network or non-200 responses.
 * 5.  Metadata Extraction (`extractMetadata`):
 * - Takes a JSDOM `document` object.
 * - Extracts the title from the `<title>` tag.
 * - Attempts to extract the author from common meta tags (`meta[name="author"]`, `meta[property="article:author"]`).
 * - Attempts to extract the publication date from common meta tags/elements (`meta[property="article:published_time"]`, `meta[name="date"]`, `time[pubdate]`).
 * - Returns an object containing the extracted metadata (title is mandatory, others are optional).
 * 6.  Main Content Extraction (`extractMainContentHtml`):
 * - Takes a JSDOM `document` object.
 * - Tries to find the main article content by looking for common semantic tags (`<article>`, `<main>`) or specific IDs/classes often used for content (`#content`, `.post-content`, etc.). This is heuristic and might need adjustment for different website structures.
 * - If a specific content container is found, returns its `innerHTML`.
 * - As a fallback, returns the `innerHTML` of the `<body>` tag, which might include unwanted elements (headers, footers, ads).
 * 7.  Filename Sanitization (`sanitizeFilename`):
 * - Takes a string (intended to be the article title).
 * - Removes potential HTML tags (though unlikely in a title).
 * - Converts the string to lowercase.
 * - Replaces spaces and sequences of non-alphanumeric characters (excluding hyphens) with single hyphens.
 * - Removes leading/trailing hyphens.
 * - Truncates the filename if it's excessively long.
 * - Appends the `.md` extension.
 * 8.  Markdown Generation (`generateMarkdownFileContent`):
 * - Takes the extracted metadata object and the Markdown content string.
 * - Initializes `TurndownService`.
 * - Formats the metadata into a YAML frontmatter block. Only includes metadata fields that have values.
 * - Combines the YAML frontmatter, a separator (`---`), and the Markdown content.
 * - Returns the complete string ready to be written to the file.
 * 9.  File Writing (`writeMarkdownFile`):
 * - Takes the sanitized filename and the complete file content string.
 * - Uses `fs/promises.writeFile` to save the content to the specified file.
 * - Logs success or error messages to the console.
 * 10. Main Execution (`run`):
 * - An async function that orchestrates the entire process.
 * - Calls `parseCliArguments` to get the URL.
 * - Calls `fetchHtmlContent` to get the HTML.
 * - Creates a JSDOM instance from the HTML.
 * - Calls `extractMetadata` and `extractMainContentHtml`.
 * - Initializes TurndownService and converts the extracted HTML content to Markdown.
 * - Calls `sanitizeFilename` using the extracted title.
 * - Calls `generateMarkdownFileContent` to assemble the final output string.
 * - Calls `writeMarkdownFile` to save the result.
 * - Includes error handling for each step, logging informative messages to the console.
 * 11. Script Entry Point: Calls the `run()` function to start the process when the script is executed.
 */

import { writeFile } from "node:fs/promises";
import { parseArgs } from "node:util";
import TurndownService from "turndown";
import { JSDOM } from "jsdom";

interface Metadata {
  title: string;
  author?: string;
  publishedDate?: string;
  sourceUrl: string;
}

interface Arguments {
  url: string;
}

function parseCliArguments(): Arguments {
  try {
    const { values } = parseArgs({
      options: {
        url: {
          type: "string",
          short: "u",
        },
      },
      strict: true,
    });

    if (!values.url) {
      throw new Error("Missing required argument: --url <article URL>");
    }

    // Basic URL validation (can be improved)
    try {
      new URL(values.url);
    } catch (_) {
      throw new Error(`Invalid URL provided: ${values.url}`);
    }

    return { url: values.url };
  } catch (err: any) {
    console.error("Argument parsing error:", err.message);
    console.log("Usage: bun run article-to-markdown.ts --url <article URL>");
    process.exit(1);
  }
}

async function fetchHtmlContent(url: string): Promise<string> {
  try {
    console.log(`Fetching article from: ${url}`);
    const response = await fetch(url, {
      headers: {
        // Some sites might block default fetch user agents
        "User-Agent":
          "Mozilla/5.0 (compatible; ArticleToMarkdownBot/1.0; +https://example.com/bot)",
        Accept: "text/html",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch: ${response.status} ${response.statusText}`,
      );
    }

    const html = await response.text();
    console.log("Successfully fetched HTML content.");
    return html;
  } catch (error: any) {
    console.error(`Error fetching URL [${url}]:`, error.message);
    throw error; // Re-throw to be caught by the main run function
  }
}

function extractMetadata(document: Document, sourceUrl: string): Metadata {
  const title =
    document.querySelector("title")?.textContent?.trim() ?? "Untitled Article";

  const authorSelectors = [
    'meta[name="author"]',
    'meta[property="article:author"]',
    'meta[name="creator"]',
  ];
  let author: string | undefined;
  for (const selector of authorSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      author = element.getAttribute("content")?.trim();
      if (author) break;
    }
  }

  const dateSelectors = [
    'meta[property="article:published_time"]',
    'meta[name="date"]',
    'meta[name="dc.date.issued"]',
    "time[pubdate]",
    "time[datetime]",
  ];
  let publishedDate: string | undefined;
  for (const selector of dateSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      const dateValue =
        element.getAttribute("content") ||
        element.getAttribute("datetime") ||
        element.textContent;
      publishedDate = dateValue?.trim();
      if (publishedDate) break;
    }
  }

  return {
    title,
    author,
    publishedDate,
    sourceUrl,
  };
}

function extractMainContentHtml(document: Document): string {
  const contentSelectors = [
    "article", // Semantic article tag
    "main", // Semantic main tag
    '[role="main"]', // ARIA role
    ".content", // Common class names
    "#content",
    ".entry-content",
    ".post-content",
    ".main-content",
    "#main",
    ".article-body",
    ".story-content",
  ];

  let contentElement: Element | null = null;
  for (const selector of contentSelectors) {
    contentElement = document.querySelector(selector);
    if (contentElement) {
      console.log(`Found main content using selector: ${selector}`);
      break;
    }
  }

  if (contentElement) {
    // Optional: Clean up common unwanted elements within the main content
    contentElement
      .querySelectorAll(
        "script, style, noscript, iframe, header, footer, nav, aside, .ad, .advertisement, .related-posts, .comments",
      )
      .forEach((el) => el.remove());
    return contentElement.innerHTML;
  } else {
    console.warn(
      "Could not find specific main content element, falling back to <body>.",
    );
    // Fallback to body, but try to remove script/style tags first
    const bodyClone = document.body.cloneNode(true) as HTMLElement;
    bodyClone
      .querySelectorAll("script, style, noscript")
      .forEach((el) => el.remove());
    return bodyClone.innerHTML;
  }
}

function sanitizeFilename(name: string): string {
  const cleanedName = name
    .replace(/<[^>]*>/g, "") // Remove any potential HTML tags
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\p{M}\s-]/gu, "") // Remove most punctuation and symbols, keeping letters, numbers, marks, spaces, hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with a single one
    .replace(/^-+|-+$/g, ""); // Trim leading/trailing hyphens

  const maxLength = 100; // Limit filename length
  const truncatedName =
    cleanedName.length > maxLength
      ? cleanedName.substring(0, maxLength)
      : cleanedName;

  return `${truncatedName || "downloaded-article"}.md`;
}

function generateMarkdownFileContent(
  metadata: Metadata,
  markdownContent: string,
): string {
  let frontmatter = "---\n";
  frontmatter += `title: ${JSON.stringify(metadata.title)}\n`; // Use JSON.stringify for proper escaping
  if (metadata.author) {
    frontmatter += `author: ${JSON.stringify(metadata.author)}\n`;
  }
  if (metadata.publishedDate) {
    frontmatter += `publishedDate: ${JSON.stringify(metadata.publishedDate)}\n`;
  }
  frontmatter += `sourceUrl: ${metadata.sourceUrl}\n`;
  frontmatter += "---\n\n";

  return frontmatter + markdownContent;
}

async function writeMarkdownFile(
  filename: string,
  content: string,
): Promise<void> {
  try {
    await writeFile(filename, content, "utf-8");
    console.log(`Successfully saved article to: ${filename}`);
  } catch (error: any) {
    console.error(`Error writing file [${filename}]:`, error.message);
    throw error; // Re-throw
  }
}

async function run() {
  try {
    const { url } = parseCliArguments();
    const html = await fetchHtmlContent(url);

    console.log("Parsing HTML content...");
    const dom = new JSDOM(html, { url }); // Provide URL for resolving relative links if needed
    const document = dom.window.document;
    console.log("HTML parsed successfully.");

    const metadata = extractMetadata(document, url);
    const mainContentHtml = extractMainContentHtml(document);

    if (!mainContentHtml) {
      throw new Error("Could not extract any content from the page.");
    }

    console.log("Converting HTML content to Markdown...");
    const turndownService = new TurndownService({
      headingStyle: "atx", // Use # for headings
      codeBlockStyle: "fenced", // Use ``` for code blocks
    });
    // Optional: Add rules for specific elements if needed
    // turndownService.addRule('strikethrough', {
    //   filter: ['del', 's', 'strike'],
    //   replacement: function (content) {
    //     return '~' + content + '~'
    //   }
    // })
    const markdown = turndownService.turndown(mainContentHtml);
    console.log("Markdown conversion complete.");

    const filename = sanitizeFilename(metadata.title);
    const fileContent = generateMarkdownFileContent(metadata, markdown);

    await writeMarkdownFile(filename, fileContent);
  } catch (error: any) {
    // Errors from fetching, parsing, or writing should be caught here
    console.error("\n--- An error occurred during execution ---");
    // The specific error message should have already been logged by the function that threw it.
    // console.error("Error details:", error); // Uncomment for more detailed debugging if needed
    console.error("------------------------------------------");
    process.exit(1); // Exit with a non-zero code to indicate failure
  }
}

// --- Script Entry Point ---
run();
