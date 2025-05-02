/**
 * This script processes an OPML feed file to download and convert recent articles to Markdown.
 *
 * How it works:
 * 1.  Dependencies: Imports necessary modules:
 * - `parseArgs` from `util` for command-line argument parsing.
 * - `fs` from `node:fs/promises` and `path` from `node:path` for file system operations.
 * - `Parser` from `rss-parser` to parse RSS/Atom feeds (but NOT the OPML file itself).
 * - `XMLParser` from `fast-xml-parser` to reliably parse the input OPML file.
 * - `Readability` from `@mozilla/readability` to extract article content.
 * - `TurndownService` from `turndown` to convert HTML to Markdown.
 * - `JSDOM` from `jsdom` to create a DOM environment for Readability.
 *
 * 2.  Argument Parsing and Validation (`parseCliArgs` function):
 * - Defines the expected command-line options (`--days`, `--feed`).
 * - Uses `parseArgs` to parse the arguments provided when running the script.
 * - Validates that `--days` is provided, is a number, and is positive.
 * - Validates that `--feed` is provided and is a string.
 * - Checks if the file specified by `--feed` exists and ends with `.opml`.
 * - Returns the validated `days` and `feed` path or throws an error if validation fails.
 *
 * 3.  File Existence Check (`checkFileExists` function):
 * - Verifies that the provided OPML file path exists and is accessible.
 *
 * 4.  Date Calculation (`getDates` function):
 * - Takes the number of `days` as input.
 * - Calculates the end date (current date) and start date (current date minus `days`).
 * - Formats both dates as `YYYY-MM-DD`.
 * - Returns the formatted start and end dates.
 *
 * 5.  Directory Setup (`setupDirectory` function):
 * - Takes the `feed` path and the calculated start/end dates.
 * - Extracts the base name of the feed file without the extension (`feed_name`).
 * - Constructs the output directory name: `${feed_name}_${startDate}_${endDate}`.
 * - Creates the directory using `fs.mkdir`. If the directory already exists, it continues without error (`recursive: true`).
 * - Logs the path of the created/used directory.
 * - Returns the full path to the output directory.
 *
 * 6.  Filename Sanitization (`sanitizeFilename` function):
 * - Takes a string (intended article title).
 * - Removes characters that are typically invalid or problematic in filenames (`/`, `\`, `:`, `*`, `?`, `"`, `<`, `>`, `|`).
 * - Replaces sequences of whitespace with a single underscore.
 * - Trims leading/trailing whitespace/underscores.
 * - Limits the filename length to 200 characters to avoid potential filesystem issues.
 * - Appends `.md` to the sanitized string.
 * - Returns the sanitized filename.
 *
 * 7.  OPML Parsing (`parseOpml` function):
 * - Takes the `feed` path.
 * - Reads the OPML file content using `Bun.file().text()`.
 * - Initializes `fast-xml-parser` to parse the XML structure, ensuring attributes are captured.
 * - Parses the OPML content into a JavaScript object.
 * - Defines a recursive function `extractUrls` to traverse the parsed OPML structure (typically `opml.body.outline`).
 * - Extracts `xmlUrl` attributes from `outline` elements where the `type` is 'rss'. Handles nested outlines.
 * - Logs the number of feeds found.
 * - Returns an array of feed URLs. Includes error handling for file reading and XML parsing. This approach is more reliable for OPML than using rss-parser's `parseString`.
 *
 * 8.  Article Processing (`processArticle` function):
 * - Takes an article object (from `rss-parser`), the number of `days` ago to check, the output directory path, and an instance of `TurndownService`.
 * - Checks if the article has a title, link, and publication date (`isoDate`). Skips if any are missing.
 * - Parses the article's publication date. Skips if the date is invalid.
 * - Calculates the date threshold (current time minus `days`).
 * - Skips the article if its publication date is before the threshold.
 * - Logs that the article is being processed.
 * - Fetches the HTML content of the article from its link using `fetch`. Handles potential fetch errors.
 * - Creates a virtual DOM using `JSDOM` from the fetched HTML.
 * - Uses `Readability` to extract the main article content from the DOM. Skips if extraction fails or yields no content.
 * - Converts the extracted HTML content to Markdown using `turndownService.turndown()`.
 * - Prepends the article title (as a Markdown H1 heading) to the content.
 * - Sanitizes the article title to create a valid filename using `sanitizeFilename`.
 * - Constructs the full path for the output Markdown file.
 * - Writes the Markdown content to the file using `Bun.write()`. Handles potential write errors.
 * - Logs success or specific errors encountered during fetching, parsing, or writing.
 *
 * 9.  Feed Processing (`processFeed` function):
 * - Takes a feed URL, the number of `days`, the output directory path, an instance of `rss-parser`, and an instance of `TurndownService`.
 * - Logs that the feed is being processed.
 * - Fetches and parses the RSS/Atom feed using `rssParser.parseURL()`. This is where `rss-parser` is used correctly.
 * - If the feed has items (articles), it processes each article concurrently using `Promise.allSettled` and the `processArticle` function. `Promise.allSettled` is used to ensure that even if one article fails, others continue processing.
 * - Logs the number of articles found in the feed.
 * - Includes error handling for fetching or parsing the feed itself.
 *
 * 10. Main Execution (`main` function):
 * - An `async` function that orchestrates the entire process.
 * - Calls `parseCliArgs` to get and validate arguments.
 * - Calls `checkFileExists` to ensure the OPML file is present.
 * - Calls `getDates` to determine the date range.
 * - Calls `setupDirectory` to create the output folder.
 * - Initializes `rss-parser` (for RSS/Atom feeds) and `turndown`.
 * - Calls `parseOpml` (now using `fast-xml-parser`) to get the list of feed URLs from the OPML file.
 * - If feeds are found, it processes each feed concurrently using `Promise.allSettled` and the `processFeed` function.
 * - Logs completion or any top-level errors.
 *
 * 11. Script Entry Point:
 * - Calls the `main()` function to start the script execution.
 */

import { parseArgs } from "node:util";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import RssParser from "rss-parser"; // Renamed to avoid conflict
import { XMLParser } from "fast-xml-parser";
import { Readability } from "@mozilla/readability";
import TurndownService from "turndown";
import { JSDOM } from "jsdom";

interface CliArgs {
  days: number;
  feed: string;
}

interface Dates {
  startDate: string;
  endDate: string;
}

interface XmlOutline {
  "@_type"?: string;
  "@_text"?: string;
  "@_title"?: string;
  "@_xmlUrl"?: string;
  "@_htmlUrl"?: string;
  outline?: XmlOutline | XmlOutline[]; // Can be single or array
}

interface ParsedXmlOpml {
  opml?: {
    head?: any;
    body?: {
      outline?: XmlOutline | XmlOutline[]; // Can be single or array
    };
  };
}

type RssItem = RssParser.Item & {
  isoDate?: string;
  pubDate?: string;
  creator?: string;
  link?: string;
  title?: string;
  content?: string;
  contentSnippet?: string;
};

function parseCliArgs(): CliArgs {
  try {
    const options = {
      days: { type: "string" as const },
      feed: { type: "string" as const },
    };
    const { values } = parseArgs({ options, strict: true });

    if (!values.days) {
      throw new Error("--days argument is required.");
    }
    const daysNum = Number(values.days);
    if (isNaN(daysNum) || !Number.isInteger(daysNum) || daysNum <= 0) {
      throw new Error("--days must be a positive integer.");
    }

    if (!values.feed) {
      throw new Error("--feed argument is required.");
    }
    if (
      typeof values.feed !== "string" ||
      !values.feed.toLowerCase().endsWith(".opml")
    ) {
      throw new Error("--feed must be a valid path to an .opml file.");
    }

    return { days: daysNum, feed: values.feed };
  } catch (err: any) {
    console.error(`\n❌ Error parsing arguments: ${err.message}`);
    console.log(
      "\nUsage: bun run index.ts --days <number> --feed <path/to/feed.opml>",
    );
    process.exit(1);
  }
}

async function checkFileExists(filePath: string): Promise<void> {
  try {
    await fs.access(filePath);
  } catch (error) {
    throw new Error(`Feed file not found or inaccessible: ${filePath}`);
  }
}

function getDates(daysAgo: number): Dates {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - daysAgo);

  const formatDate = (date: Date): string => {
    return date.toISOString().split("T")[0];
  };

  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  };
}

async function setupDirectory(
  feedPath: string,
  startDate: string,
  endDate: string,
): Promise<string> {
  const feedName = path.basename(feedPath, path.extname(feedPath));
  const dirName = `${feedName}_${startDate}_${endDate}`;
  const fullPath = path.resolve(process.cwd(), dirName);

  try {
    await fs.mkdir(fullPath, { recursive: true });
    console.log(`\n📁 Output directory set up: ${fullPath}`);
    return fullPath;
  } catch (err: any) {
    console.error(`❌ Error creating directory "${fullPath}": ${err.message}`);
    process.exit(1);
  }
}

function sanitizeFilename(title: string): string {
  const cleaned = title
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, "_")
    .trim()
    .substring(0, 200);
  return `${cleaned || "untitled"}.md`;
}

async function parseOpml(opmlPath: string): Promise<string[]> {
  console.log(`\n📄 Parsing OPML file using XML parser: ${opmlPath}`);
  try {
    const opmlContent = await Bun.file(opmlPath).text();
    const parser = new XMLParser({
      ignoreAttributes: false, // Need attributes like xmlUrl
      attributeNamePrefix: "@_", // Default prefix for attributes
      allowBooleanAttributes: true,
    });
    const parsedXml: ParsedXmlOpml = parser.parse(opmlContent);
    const feedUrls: string[] = [];

    function extractUrls(outline: XmlOutline | XmlOutline[] | undefined) {
      if (!outline) return;

      const outlines = Array.isArray(outline) ? outline : [outline];

      for (const item of outlines) {
        // Check for the xmlUrl attribute and type 'rss'
        if (item["@_type"] === "rss" && item["@_xmlUrl"]) {
          feedUrls.push(item["@_xmlUrl"]);
        }
        // Recursively process nested outlines
        if (item.outline) {
          extractUrls(item.outline);
        }
      }
    }

    // Start extraction from the body outline(s)
    extractUrls(parsedXml?.opml?.body?.outline);

    if (feedUrls.length === 0) {
      console.warn("⚠️ No feed URLs found in the OPML file.");
    } else {
      console.log(`   Found ${feedUrls.length} feed URLs.`);
    }
    return feedUrls;
  } catch (err: any) {
    console.error(
      `❌ Error reading or parsing OPML file "${opmlPath}" with XML parser: ${err.message}`,
    );
    return []; // Return empty array on error
  }
}

async function processArticle(
  item: RssItem,
  daysAgo: number,
  dumpDir: string,
  turndownService: TurndownService,
): Promise<void> {
  if (!item.title || !item.link || !item.isoDate) {
    return;
  }

  let articleDate: Date;
  try {
    articleDate = new Date(item.isoDate);
    if (isNaN(articleDate.getTime())) {
      throw new Error("Invalid date format");
    }
  } catch (e) {
    return;
  }

  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() - daysAgo);

  if (articleDate < thresholdDate) {
    return;
  }

  console.log(`      ↳ Processing article: "${item.title}"`);

  let htmlContent: string;
  try {
    const response = await fetch(item.link, {
      headers: { "User-Agent": "BunRSSProcessor/1.0" },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    htmlContent = await response.text();
  } catch (err: any) {
    console.error(
      `      ❌ Failed to fetch "${item.title}" (${item.link}): ${err.message}`,
    );
    return;
  }

  let articleContent: string | null;
  try {
    const dom = new JSDOM(htmlContent, { url: item.link });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    if (!article || !article.content) {
      console.warn(
        `      ⚠️ Could not extract readable content for "${item.title}". Skipping.`,
      );
      return;
    }
    articleContent = article.content;
  } catch (err: any) {
    console.error(
      `      ❌ Failed to parse content for "${item.title}": ${err.message}`,
    );
    return;
  }

  let markdownContent: string;
  try {
    markdownContent = turndownService.turndown(articleContent);
  } catch (err: any) {
    console.error(
      `      ❌ Failed to convert content to Markdown for "${item.title}": ${err.message}`,
    );
    return;
  }

  const finalMarkdown = `# ${item.title}\n\n${markdownContent}`;
  const filename = sanitizeFilename(item.title);
  const filePath = path.join(dumpDir, filename);

  try {
    await Bun.write(filePath, finalMarkdown);
  } catch (err: any) {
    console.error(
      `      ❌ Failed to save Markdown for "${item.title}" to ${filePath}: ${err.message}`,
    );
  }
}

async function processFeed(
  feedUrl: string,
  daysAgo: number,
  dumpDir: string,
  rssParser: RssParser, // Use the renamed import
  turndownService: TurndownService,
): Promise<void> {
  console.log(`   🔗 Processing feed: ${feedUrl}`);
  try {
    const feed = await rssParser.parseURL(feedUrl);
    console.log(`      Found ${feed.items?.length ?? 0} items in feed.`);

    if (feed.items && feed.items.length > 0) {
      const articlePromises = feed.items.map((item) =>
        processArticle(item as RssItem, daysAgo, dumpDir, turndownService),
      );
      await Promise.allSettled(articlePromises);
    }
  } catch (err: any) {
    console.error(`   ❌ Error processing feed "${feedUrl}": ${err.message}`);
  }
}

async function main() {
  console.log("🚀 Starting RSS Feed Processor...");

  const { days, feed: feedPath } = parseCliArgs();
  await checkFileExists(feedPath);

  const { startDate, endDate } = getDates(days);
  const dumpDir = await setupDirectory(feedPath, startDate, endDate);

  const rssParser = new RssParser({
    // Initialize rss-parser for actual feeds
    timeout: 10000,
    headers: { "User-Agent": "BunRSSProcessor/1.0" },
  });
  const turndownService = new TurndownService({ headingStyle: "atx" });

  // Use the new XML-based OPML parser
  const feedUrls = await parseOpml(feedPath);

  if (feedUrls.length > 0) {
    console.log(
      `\n🔍 Processing ${feedUrls.length} feeds for articles from the last ${days} days...`,
    );
    const feedPromises = feedUrls.map((url) =>
      processFeed(url, days, dumpDir, rssParser, turndownService),
    );
    await Promise.allSettled(feedPromises);
  }

  console.log("\n✅ Processing complete.");
}

main().catch((err) => {
  console.error("\n💥 An unexpected error occurred:", err);
  process.exit(1);
});
