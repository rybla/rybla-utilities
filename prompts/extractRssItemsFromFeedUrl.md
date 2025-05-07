Implement `extractFeedUrls` in the following context:

```ts
import RssParser from "rss-parser";
import { parseString } from "xml2js";
import fs from "fs/promises";

/** Extracts feed URLs from an OPML file */
export default async function extractFeedUrls(
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
export async function extractRssItemsFromFeedUrl(
  url: string,
): Promise<RssItem[]> {
  // TODO
}

```

Make sure to:
- use `async/await` style
- handle errors gracefully
- log informative messages to the console while processing
