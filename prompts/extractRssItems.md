Implement `extractRssItems` in the following context:

```ts
import RssParser from "rss-parser";
import { parseString } from "xml2js";
import fs from "fs/promises";
import { Readability } from "@mozilla/readability";
import TurndownService from "turndown";
import { JSDOM } from "jsdom";

/** Extracts feed URLs from an OPML file */
export async function extractFeedUrls(
  feed_filepath: string,
): Promise<string[]> {
  console.log(`Starting to extract feed URLs from: ${feed_filepath}`);
  try {
    const fileContent = await fs.readFile(feed_filepath, { encoding: "utf8" });
    console.log(`Successfully read file: ${feed_filepath}`);

    const result = await new Promise<any>((resolve, reject) => {
      parseString(fileContent, (err, parsedResult) => {
        if (err) {
          reject(err);
        } else {
          resolve(parsedResult);
        }
      });
    });
    console.log("Successfully parsed OPML XML.");

    const feedUrls: string[] = [];

    const collectUrls = (outlines: any[]) => {
      if (!outlines || !Array.isArray(outlines)) {
        return;
      }
      for (const outline of outlines) {
        if (outline.$ && outline.$.xmlUrl) {
          feedUrls.push(outline.$.xmlUrl);
        }
        if (outline.outline) {
          collectUrls(outline.outline);
        }
      }
    };

    if (
      result.opml &&
      result.opml.body &&
      result.opml.body[0] &&
      result.opml.body[0].outline
    ) {
      collectUrls(result.opml.body[0].outline);
    } else {
      console.warn(
        "OPML structure might be different than expected, or no 'outline' elements found in the body.",
      );
    }

    if (feedUrls.length === 0) {
      console.log("No feed URLs found in the OPML file.");
    } else {
      console.log(`Extracted ${feedUrls.length} feed URLs.`);
    }
    return feedUrls;
  } catch (error) {
    console.error(`Error processing OPML file ${feed_filepath}:`, error);
    return [];
  }
}

export type RssItem = RssParser.Item & {
  isoDate?: string;
  pubDate?: string;
  creator?: string;
  link?: string;
  title?: string;
  content?: string;
  contentSnippet?: string;
};

/** Extracts RSS items from a feed URL */
export async function extractRssItems(feed_url: string): Promise<RssItem[]> {
  console.log(`Attempting to fetch RSS items from URL: ${feed_url}`);
  const parser = new RssParser();

  try {
    const feed = await parser.parseURL(feed_url);
    console.log(
      `Successfully fetched and parsed RSS feed from ${feed_url}. Found ${feed.items.length} items.`,
    );
    // The items from parser.parseURL should largely conform to RssItem.
    // RssParser.Item already includes most of these fields.
    // The type assertion `feed.items as RssItem[]` can be used if necessary,
    // but often isn't strictly needed if the types are compatible.
    return feed.items as RssItem[];
  } catch (error) {
    console.error(
      `Error fetching or parsing RSS feed from ${feed_url}:`,
      error,
    );
    return []; // Return an empty array in case of an error
  }
}

/** Extracts the human-readable article content, in Markdown format from the article linked to in the RSS item. */
export async function extractArticleContent(item: RssItem): Promise<string> {
  // TODO
}
```

Use `jsdom` to parse the HTML content.
Use the `@mozilla/readability` library to extract the human-readable article content.
Use `turndown` to convert the HTML content to Markdown.

Also make sure to:
- use `async/await` style
- handle errors gracefully
- log informative messages to the console while processing
