/**
 * This file contains a TypeScript function, `extractArticleContent`, designed to fetch,
 * parse, and extract meaningful content and metadata from a web article URL.
 * It leverages the `node-fetch` library for HTTP requests, `jsdom` for creating a
 * Document Object Model (DOM) from the fetched HTML, and `@mozilla/readability`
 * for isolating the primary article content from surrounding clutter (like navigation,
 * ads, and footers).
 *
 * The file is organized as follows:
 * 1. Import necessary modules:
 * - `fetch` from `node-fetch` (or a compatible fetch implementation) for making HTTP requests.
 * - `JSDOM` from `jsdom` to parse HTML strings into a DOM structure.
 * - `Readability` from `@mozilla/readability` to process the DOM and extract article data.
 *
 * 2. Type Definition for `ArticleInfo`:
 * - This type alias defines the structure of the object returned by the main function.
 * - It includes:
 * - `url`: The original URL of the article.
 * - `thumbnail_url`: The URL of a representative image for the article.
 * - `title`: The main title of the article.
 * - `author`: The author(s) of the article.
 * - `pubDate`: The publication date of the article.
 * - `body`: The main content of the article, as an HTML string.
 *
 * 3. The `extractArticleContent` async function:
 * - Takes a `url` string as input.
 * - Returns a `Promise<ArticleInfo>`.
 * - Steps within the function:
 * a. Fetch HTML: It first attempts to fetch the HTML content from the provided URL
 * using `fetch`. If the request fails or returns a non-OK status, it throws
 * a descriptive error.
 * b. Parse HTML with JSDOM: The fetched HTML string is then parsed into a DOM
 * object using `JSDOM`. The original URL is passed to the JSDOM constructor
 * to help resolve any relative URLs within the document, which is crucial for
 * Readability and for resolving potential thumbnail URLs.
 * c. Extract Article with Readability: An instance of `Readability` is created
 * with the JSDOM document. The `parse()` method is called to extract the
 * article. If `parse()` returns `null` or the extracted content is empty,
 * it means Readability could not identify a main article, and an error is thrown.
 * d. Metadata Extraction:
 * - `title`: Primarily taken from `Readability's` parsed article title. If unavailable,
 * it falls back to the HTML document's `<title>` tag.
 * - `author`: Primarily taken from `Readability's` `byline`. If unavailable, it
 * searches common meta tags: `meta[name="author"]`, `meta[property="article:author"]`,
 * `meta[name="twitter:creator"]`.
 * - `pubDate`: Extracted by querying the DOM for various standard meta tags
 * (e.g., `article:published_time`, `og:published_time`, `date`, `pubdate`) and
 * the HTML5 `<time datetime="...">` element.
 * - `thumbnail_url`: Extracted by querying for Open Graph (`og:image`), Twitter
 * Card (`twitter:image`), and other common image-related meta tags/link elements.
 * - `body`: The core HTML content of the article, as provided by `Readability's article.content`.
 * - `url`: The original input URL is directly assigned.
 * e. Fallbacks: If specific metadata (title, author, pubDate, thumbnail_url) cannot be
 * found, a "not found" string is used as a placeholder.
 * f. Error Handling: The function is wrapped in a `try...catch` block to handle
 * any errors during the process (network, parsing, Readability extraction),
 * re-throwing them with descriptive messages.
 *
 * Dependencies required for this code:
 * - `node-fetch` (or a compatible fetch API provider)
 * - `jsdom`
 * - `@mozilla/readability`
 * - Corresponding TypeScript type definitions: `@types/jsdom`, `@types/mozilla__readability`.
 * (Note: `node-fetch` v3+ includes its own types; for v2, `@types/node-fetch` would be needed).
 */

import { JSDOM } from "jsdom";
import { Readability, isProbablyReaderable } from "@mozilla/readability";
import { do_, slugifyFilename, withTimeout } from "./utilities";
import TurndownService from "turndown";
import * as fs from "fs/promises";

const turndown = new TurndownService();

export type ArticleInfo = {
  url: string;
  thumbnail_url: string;
  title: string;
  author: string;
  pubDate: string;
  content: string;
};

export async function extractArticleContent(url: string): Promise<ArticleInfo> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });
    if (!response.ok) {
      throw new Error(
        `Failed to fetch URL: ${url}. Status: ${response.status} ${response.statusText}`,
      );
    }
    const html = await response.text();

    const dom = new JSDOM(html, { url });
    const doc = dom.window.document;

    if (!isProbablyReaderable(doc)) {
      throw new Error(
        `Content from URL: ${url} is not suitable for Readability. It might not be an article.`,
      );
    }

    const reader = new Readability(doc);
    const article = reader.parse();

    if (!article || !article.content) {
      throw new Error(
        `Could not extract article content from URL: ${url}. The page might not be a valid article or is structured in a way that Readability could not process.`,
      );
    }

    const title = article.title || doc.title || "Title not found";

    let author = article.byline || "";
    if (!author) {
      const authorSelectors = [
        'meta[name="author"]',
        'meta[property="article:author"]',
        'meta[property="og:article:author"]',
        'meta[name="twitter:creator"]',
        'meta[name="dc.creator"]',
        'meta[name="DC.creator"]',
      ];
      for (const selector of authorSelectors) {
        const element = doc.querySelector(selector);
        if (element) {
          author = element.getAttribute("content")?.trim() || "";
          if (author) break;
        }
      }
    }
    if (!author) {
      author = "Author not found";
    }

    let pubDate = "";
    const pubDateSelectors = [
      {
        selector: 'meta[property="article:published_time"]',
        attribute: "content",
      },
      { selector: 'meta[property="og:published_time"]', attribute: "content" },
      { selector: 'meta[name="pubdate"]', attribute: "content" },
      { selector: 'meta[name="date"]', attribute: "content" },
      { selector: 'meta[name="dcterms.date"]', attribute: "content" },
      { selector: 'meta[name="DC.date"]', attribute: "content" },
      { selector: 'meta[itemprop="datePublished"]', attribute: "content" },
      { selector: "time[datetime]", attribute: "datetime" },
      { selector: "time[pubdate]", attribute: "datetime" },
    ];
    for (const { selector, attribute } of pubDateSelectors) {
      const element = doc.querySelector(selector);
      if (element) {
        pubDate = element.getAttribute(attribute)?.trim() || "";
        if (pubDate) break;
      }
    }
    if (!pubDate) {
      pubDate = "Publication date not found";
    }

    let thumbnailUrl = "";
    const thumbnailSelectors = [
      { selector: 'meta[property="og:image"]', attribute: "content" },
      { selector: 'meta[property="twitter:image"]', attribute: "content" },
      { selector: 'link[rel="image_src"]', attribute: "href" },
      { selector: 'meta[itemprop="image"]', attribute: "content" },
    ];
    for (const { selector, attribute } of thumbnailSelectors) {
      const element = doc.querySelector(selector);
      if (element) {
        const potentialUrl = element.getAttribute(attribute)?.trim();
        if (potentialUrl) {
          try {
            thumbnailUrl = new URL(potentialUrl, url).href;
            break;
          } catch (e) {
            // Invalid URL, try next
          }
        }
      }
    }
    if (!thumbnailUrl) {
      thumbnailUrl = "Thumbnail not found";
    }

    const content_html = article.content;

    const content = turndown.turndown(content_html);

    return {
      url,
      title,
      author,
      pubDate,
      thumbnail_url: thumbnailUrl,
      content: content,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error processing URL ${url}: ${error.message}`);
    }
    throw new Error(`An unknown error occurred while processing URL ${url}`);
  }
}

async function main() {
  const urls_filepath = "/Users/henry/Downloads/reading_list_original.txt";

  const urls_content = await fs.readFile(urls_filepath, { encoding: "utf8" });
  const urls = urls_content.trim().split("\n");

  // const urls = [
  //   "https://arxiv.org/abs/1002.2284",
  //   "https://mbuffett.com/posts/structured-editing-syntax/",
  // ];

  const threads = urls.map((url) =>
    do_(async () => {
      try {
        withTimeout(
          do_(async () => {
            const articleInfo = await extractArticleContent(url);
            fs.writeFile(
              `/Users/henry/Library/Mobile Documents/com~apple~CloudDocs/article_bag/${slugifyFilename(articleInfo.title)}.json`,
              JSON.stringify(articleInfo, null, 4),
            );
            console.log(`✅ ${url}`);
          }),
          5000,
        );
      } catch (e: any) {
        console.error(`❌ ${url}\n    ${e.toString()}`);
      }
    }),
  );

  const step = 20;
  for (let i = 0; i < threads.length; i += step) {
    await Promise.all(threads.slice(i, i + step));
  }
}
main();
