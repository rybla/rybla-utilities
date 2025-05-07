import RssParser from "rss-parser";
import { parseString } from "xml2js";
import fs from "fs/promises";
import { Readability } from "@mozilla/readability";
import TurndownService from "turndown";
import { JSDOM } from "jsdom";
import * as google from "@google/generative-ai";

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
  console.log(
    `Attempting to extract article content for item: "${item.title}"`,
  );
  if (!item.link) {
    throw new Error(`Item "${item.title}" has no link.`);
  }

  console.log(`Fetching content from URL: ${item.link}`);
  try {
    const response = await fetch(item.link);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch ${item.link}. Status: ${response.status} ${response.statusText}`,
      );
    }
    const htmlContent = await response.text();
    console.log(
      `Successfully fetched HTML content from ${item.link}. Length: ${htmlContent.length}`,
    );

    console.log("Parsing HTML content with JSDOM...");
    const dom = new JSDOM(htmlContent, {
      url: item.link, // Provide the URL for Readability to resolve relative paths
    });
    console.log("HTML content parsed successfully.");

    console.log("Extracting article using @mozilla/readability...");
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    if (!article || !article.content) {
      throw new Error(
        `Could not extract readable content for "${item.title}" from ${item.link}.`,
      );
    }
    console.log(
      `Successfully extracted readable content. Title: "${article.title}", Length: ${article.content.length}`,
    );

    console.log("Converting extracted HTML content to Markdown...");
    const turndownService = new TurndownService();
    const markdown = turndownService.turndown(article.content);
    console.log(
      `Successfully converted content to Markdown. Length: ${markdown.length}`,
    );

    return markdown;
  } catch (error: any) {
    throw new Error(
      `Error extracting article content for "${item.title}" from ${item.link}: ${error.message}`,
    );
  }
}

async function summarizeArticle(item: RssItem): Promise<string> {
  const content = await extractArticleContent(item);
  const ai = new google.GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
  const model = ai.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
  const result = await model.generateContent({
    systemInstruction:
      "The user will provide an article in Markdown format. Reply with a very concise summary, in Markdown format, that captures the main points of the article. Make sure to reply with ONLY the summary.",
    contents: [{ role: "user", parts: [{ text: content }] }],
  });
  const summary = result.response.text();
  return summary;
}

async function summarizeFeed(feed_filepath: string): Promise<string[]> {
  const feed_urls = await extractFeedUrls(feed_filepath);
  const article_urls = await Promise.all(feed_urls.map(extractRssItems)).then(
    concat,
  );
  for (const article_url of article_urls) {
    const summary = await summarizeArticle(article_url);
    console.log(`Successfully summarized article: "${article_url.title}"`);
    return [summary];
  }
  return []; // TODO
}

function concat<A>(xss: A[][]): A[] {
  return xss.reduce((acc, arr) => acc.concat(arr), [] as A[]);
}

(async () => {
  const summary = await summarizeArticle({
    link: "http://feeds.feedburner.com/marginalrevolution/feed",
  });
  console.log(`summary:\n${summary}`);
})();
