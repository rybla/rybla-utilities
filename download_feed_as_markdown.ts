/**
 * RSS Feed Aggregator Command-Line Tool (TypeScript/Bun)
 *
 * Description:
 * This script fetches content from multiple RSS feeds listed in an OPML file,
 * filters the articles based on a specified date range (YYYY-MM-DD format),
 * converts the article content from HTML to Markdown, and compiles them
 * into a single Markdown report file.
 *
 * How it Works:
 * 1.  Dependencies: Relies on 'rss-parser' for fetching/parsing RSS feeds,
 * 'turndown' for HTML-to-Markdown conversion, and 'fast-xml-parser'
 * for parsing the OPML file. These need to be installed separately
 * (e.g., `bun install rss-parser turndown fast-xml-parser @types/turndown`).
 * 2.  Argument Parsing: Uses Node.js's built-in `util.parseArgs` to handle
 * command-line arguments:
 * --opml <path>: Path to the input OPML file.
 * --start-date <YYYY-MM-DD>: Start date for filtering articles.
 * --end-date <YYYY-MM-DD>: End date for filtering articles.
 * --output <path>: Path where the output Markdown report will be saved.
 * 3.  OPML Parsing: Reads the specified OPML file and uses 'fast-xml-parser'
 * to extract the list of RSS feed URLs (`xmlUrl`) from the `<outline>` tags.
 * 4.  Date Handling: Parses the start and end dates. The start date is set
 * to the beginning of the day (00:00:00) and the end date to the end
 * of the day (23:59:59) to ensure inclusive filtering.
 * 5.  RSS Fetching & Filtering: Iterates through each feed URL:
 * - Fetches the feed content using 'rss-parser'.
 * - Filters the articles based on their publication date (`isoDate` or `pubDate`),
 * checking if it falls within the specified start and end dates.
 * 6.  Content Conversion: For each filtered article:
 * - Initializes 'turndown' service.
 * - Extracts the article title and cleans it by removing any HTML tags.
 * - Extracts the article content (preferring `content:encoded` over `content`).
 * - Converts the HTML content to Markdown using Turndown.
 * 7.  Report Generation:
 * - Creates a Markdown string starting with metadata (input file, date range).
 * - Appends each processed article to the report, formatted with a
 * Level 1 Markdown heading (`# Title`) followed by the Markdown content.
 * 8.  Output: Writes the complete Markdown report string to the specified
 * output file using Bun's `Bun.write()` function.
 * 9.  Error Handling: Includes basic try-catch blocks for file operations,
 * feed fetching, and date parsing. Logs informative messages to the console.
 *
 * Usage:
 * bun run index.ts --opml feeds.opml --start-date 2025-04-01 --end-date 2025-04-23 --output report.md
 */

import { parseArgs } from "util";
import RssParser from "rss-parser";
import TurndownService from "turndown";
import { XMLParser } from "fast-xml-parser";
import { existsSync } from "fs"; // Use Bun's fs eventually if preferred
import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";

interface OpmlOutline {
  "@_xmlUrl"?: string;
  "@_htmlUrl"?: string;
  "@_text"?: string;
  "@_title"?: string;
  outline?: OpmlOutline | OpmlOutline[];
}

interface OpmlFormat {
  opml: {
    head: {
      title?: string;
    };
    body: {
      outline?: OpmlOutline | OpmlOutline[];
    };
  };
}

const cleanHtmlTags = (input: string): string => {
  return input ? input.replace(/<[^>]*>/g, "").trim() : "";
};

const findFeedUrls = (
  outline: OpmlOutline | OpmlOutline[] | undefined,
): string[] => {
  let urls: string[] = [];
  if (!outline) {
    return urls;
  }

  const outlines = Array.isArray(outline) ? outline : [outline];

  for (const item of outlines) {
    if (item["@_xmlUrl"]) {
      urls.push(item["@_xmlUrl"]);
    }
    if (item.outline) {
      urls = urls.concat(findFeedUrls(item.outline));
    }
  }
  return urls;
};

const main = async () => {
  console.log("Starting RSS Aggregator...");

  const options = {
    opml: { type: "string" as const },
    "start-date": { type: "string" as const },
    "end-date": { type: "string" as const },
    output: { type: "string" as const },
  };

  let args;
  try {
    args = parseArgs({ options, strict: true, allowPositionals: false });
  } catch (error: any) {
    console.error("Error parsing arguments:", error.message);
    console.log(
      "Usage: bun run index.ts --opml <path> --start-date <YYYY-MM-DD> --end-date <YYYY-MM-DD> --output <path>",
    );
    process.exit(1);
  }

  const {
    opml: opmlPath,
    "start-date": startDateStr,
    "end-date": endDateStr,
    output: outputPath,
  } = args.values;

  if (!opmlPath || !startDateStr || !endDateStr || !outputPath) {
    console.error("Missing required arguments.");
    console.log(
      "Usage: bun run index.ts --opml <path> --start-date <YYYY-MM-DD> --end-date <YYYY-MM-DD> --output <path>",
    );
    process.exit(1);
  }

  if (!existsSync(opmlPath)) {
    console.error(`Error: OPML file not found at ${opmlPath}`);
    process.exit(1);
  }

  let startDate: Date;
  let endDate: Date;

  try {
    startDate = new Date(startDateStr + "T00:00:00.000Z"); // Start of the day UTC
    endDate = new Date(endDateStr + "T23:59:59.999Z"); // End of the day UTC
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error("Invalid date format.");
    }
    if (startDate > endDate) {
      throw new Error("Start date cannot be after end date.");
    }
  } catch (error: any) {
    console.error(
      `Error parsing dates: ${error.message} Please use YYYY-MM-DD format.`,
    );
    process.exit(1);
  }

  console.log(`Processing OPML file: ${opmlPath}`);
  console.log(
    `Filtering articles from ${startDate.toISOString().split("T")[0]} to ${endDate.toISOString().split("T")[0]}`,
  );
  console.log(`Outputting report to: ${outputPath}`);

  const turndownService = new TurndownService({ headingStyle: "atx" });
  const rssParser = new RssParser();
  const xmlParser = new XMLParser({ ignoreAttributes: false });

  let feedUrls: string[] = [];
  try {
    const opmlContent = await Bun.file(opmlPath).text();
    const parsedOpml: OpmlFormat = xmlParser.parse(opmlContent);
    feedUrls = findFeedUrls(parsedOpml?.opml?.body?.outline);
    if (feedUrls.length === 0) {
      console.warn("No feed URLs found in the OPML file.");
    } else {
      console.log(`Found ${feedUrls.length} feed URLs.`);
    }
  } catch (error: any) {
    console.error(
      `Error reading or parsing OPML file ${opmlPath}:`,
      error.message,
    );
    process.exit(1);
  }

  let markdownReport = `---
Date Range: ${startDateStr} to ${endDateStr}
Generated: ${new Date().toISOString()}
---

`;
  let articlesProcessed = 0;
  let feedsProcessed = 0;

  const feedProcessingPromises = feedUrls.map(async (url) => {
    try {
      console.log(`Fetching feed: ${url}`);
      const feed = await rssParser.parseURL(url);
      feedsProcessed++;
      console.log(`  Processing feed: ${feed.title || url}`);

      let feedArticles = "";
      let articlesInFeed = 0;

      if (feed.items) {
        for (const item of feed.items) {
          // console.log(JSON.stringify(item, null, 4));
          // process.exit(0);
          const pubDateStr = item.isoDate || item.pubDate;
          if (!pubDateStr) continue;

          let itemDate: Date;
          try {
            itemDate = new Date(pubDateStr);
            if (isNaN(itemDate.getTime())) continue; // Skip if date is invalid
          } catch {
            continue; // Skip if date parsing fails
          }

          if (itemDate >= startDate && itemDate <= endDate) {
            const title = cleanHtmlTags(item.title || "No Title");
            const contentHtml = await (async () => {
              const rssContent =
                item["content:encoded"] || item.content || item.summary || "";
              if (item.link !== undefined) {
                // Try to fetch the original article content
                try {
                  const response = await fetch(item.link);
                  if (response.ok) {
                    const html = await response.text();
                    // Try to extract the main content using a simple heuristic
                    const bodyMatch = /<body[^>]*>([\s\S]*)<\/body>/i.exec(
                      html,
                    );
                    if (bodyMatch && bodyMatch[1]) {
                      return bodyMatch[1];
                    }
                  }

                  // Fall back to RSS content if fetch fails or body not found
                  return rssContent;
                } catch (error) {
                  console.log(
                    `  Could not fetch content from ${item.link}, using RSS content instead`,
                  );
                  return rssContent;
                }
              } else {
                return rssContent;
              }
            })();

            // Use Readability to extract main content if possible
            let contentToConvert = contentHtml;
            try {
              // Create a DOM from the HTML content
              const dom = new JSDOM(contentHtml, {
                url: item.link || "https://example.com",
              });
              const reader = new Readability(dom.window.document);
              const article = reader.parse();

              if (article && article.content) {
                contentToConvert = article.content;
                console.log(
                  `    Successfully extracted content with Readability`,
                );
              }
            } catch (error) {
              console.log(
                `    Could not use Readability, falling back to raw HTML`,
              );
            }

            // Convert to Markdown
            const contentMarkdown = turndownService.turndown(contentToConvert);

            if (title && contentMarkdown) {
              feedArticles += `# ${title}\n\n`;
              if (item.link) {
                feedArticles += `*Source: <${item.link}>*\n`;
              }
              if (item.isoDate) {
                feedArticles += `*Published: ${item.isoDate}*\n`;
              }
              feedArticles += `\n${contentMarkdown}\n\n---\n\n`;
              console.log(`  Added article: ${title}`);
              articlesInFeed++;
            }
          }
        }
      }
      if (articlesInFeed > 0) {
        console.log(
          `  Added ${articlesInFeed} articles from ${feed.title || url}`,
        );
        articlesProcessed += articlesInFeed;
      }
      return feedArticles; // Return the markdown for this feed
    } catch (error: any) {
      console.error(`  Error processing feed ${url}: ${error.message}`);
      return ""; // Return empty string on error for this feed
    }
  });

  try {
    const results = await Promise.all(feedProcessingPromises);
    markdownReport += results.join(""); // Concatenate markdown from all feeds

    await Bun.write(outputPath, markdownReport);
    console.log(`\nSuccessfully generated Markdown report at: ${outputPath}`);
    console.log(
      `Processed ${feedsProcessed} feeds and included ${articlesProcessed} articles.`,
    );
  } catch (error: any) {
    console.error(`Error writing output file ${outputPath}:`, error.message);
    process.exit(1);
  }
};

main().catch((error) => {
  console.error("An unexpected error occurred:", error);
  process.exit(1);
});
