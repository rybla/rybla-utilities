// File: index.ts

/*
This script fetches the top 20 stories from Hacker News, downloads the linked articles,
uses @mozilla/readability and jsdom to extract the main article content from the HTML,
converts that extracted content to Markdown using turndown, and saves each
article as a .md file in a date-stamped directory.

How it works:
1.  Dependencies: It uses 'turndown' to convert HTML to Markdown, '@mozilla/readability'
    to extract the core article content, and 'jsdom' to parse HTML into a DOM structure
    that readability can process. It also uses Node.js built-in 'fs' for directory
    operations and 'path' for handling file paths.
2.  Configuration: Sets the Hacker News API base URL, the number of stories to fetch (20),
    and a User-Agent string for politeness in fetch requests.
3.  Date and Directory Setup: Gets the current date, formats it as YYYY-MM-DD, and creates
    a directory named 'hackernews-topstories_YYYY-MM-DD'. It checks if the directory
    already exists before creating it using Node's `fs.existsSync` and `fs.mkdirSync`.
4.  Fetching Top Stories: Makes an API call to `${HN_API_BASE_URL}/topstories.json` to get
    an array of the current top story IDs.
5.  Processing Stories: It takes the first `STORIES_TO_FETCH` IDs from the list and iterates
    through them.
    -   For each ID, it fetches the story details from `${HN_API_BASE_URL}/item/{id}.json`.
    -   It checks if the story data exists and has a `url` property. If not (e.g., Ask HN
        posts without links, or failed fetch), it logs a skip message and moves to the next ID.
    -   It fetches the HTML content of the article from the story's `url`, following redirects.
    -   It checks the `Content-Type` header of the response. If it's not 'text/html', it skips
        the item.
    -   It uses the `extractArticleContent` helper function:
        -   This function takes the fetched HTML and the original URL.
        -   It uses `jsdom` to parse the HTML into a DOM object.
        -   It initializes `Readability` from `@mozilla/readability` with the parsed DOM and the URL (which helps resolve relative links).
        -   It calls `readability.parse()`. If successful, this returns an object with the extracted article content (`content`), title, etc.
        -   The function returns the extracted HTML `content`.
    -   If `extractArticleContent` returns null or empty content (meaning Readability couldn't find a main article), it skips the item.
    -   It initializes a `TurndownService` instance and uses its `turndown()` method to
        convert the *extracted article HTML* (from Readability) into Markdown.
    -   It sanitizes the story title using the `sanitizeFilename` helper function to create a
        valid filename.
    -   It constructs the final filename as '{sanitized_title}_{story_id}.md'.
    -   It saves the generated Markdown content to the corresponding file path within the
        created directory using `Bun.write`.
6.  Error Handling: The processing for each story ID (fetching details, fetching article,
    parsing with JSDOM, extracting with Readability, converting, saving) is wrapped in a
    `try...catch` block. If any step fails, it logs an error message prefixed with `[SKIP]`
    or `[ERROR]`, includes the story ID and the error message, and uses `continue` to
    proceed to the next story ID without halting the entire script. Directory creation and
    top story ID fetching also have error handling, and failures there will terminate the
    script.
7.  Logging: Uses `console.log` and `console.error` with descriptive prefixes like [INFO],
    [FETCH], [SAVE], [SKIP], [ERROR] to provide clear, real-time feedback on the script's
    progress, actions, and any issues encountered during execution.
*/
import TurndownService from "turndown";
import fs from "node:fs";
import path from "node:path";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";

// --- Configuration ---
const HN_API_BASE_URL: string = "https://hacker-news.firebaseio.com/v0";
const STORIES_TO_FETCH: number = process.argv[2]
  ? parseInt(process.argv[2])
  : 20;
const USER_AGENT: string = "Bun-HN-Scraper/1.0 (github.com/your-repo)";

// --- Turndown Service Initialization ---
const turndownService = new TurndownService();

// --- Helper Functions ---

function sanitizeFilename(name: string): string {
  if (!name) {
    return "untitled";
  }
  let sanitized = name.replace(/[<>:"\/\\|?*\x00-\x1F]/g, "");
  sanitized = sanitized.replace(/\s+/g, "_");
  sanitized = sanitized.replace(/\./g, "_");
  const maxLength = 200;
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength).replace(/_$/, "");
  }
  return sanitized.length > 0 ? sanitized : "sanitized_fallback";
}

async function extractArticleContent(
  htmlContent: string,
  url: string,
): Promise<string | null> {
  try {
    const dom = new JSDOM(htmlContent, { url: url }); // Provide URL for relative path resolution
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    // article.content contains the main article HTML
    return article ? article.content! : null;
  } catch (error: any) {
    console.error(
      `[DEBUG] Error during Readability extraction for ${url}: ${error.message}`,
    );
    return null; // Return null if JSDOM or Readability fails
  }
}

// --- Main Execution Logic ---
async function main() {
  console.log("[INFO] Starting Hacker News top stories fetcher...");

  const today = new Date();
  const dateString = today.toISOString().split("T")[0];
  const dumpDir = `hackernews-topstories_${dateString}`;
  const dumpDirPath = path.resolve(dumpDir);

  try {
    if (!fs.existsSync(dumpDirPath)) {
      fs.mkdirSync(dumpDirPath);
      console.log(`[INFO] Created directory: ${dumpDirPath}`);
    } else {
      console.log(`[INFO] Directory already exists: ${dumpDirPath}`);
    }
  } catch (error: any) {
    console.error(
      `[ERROR] Failed to create directory ${dumpDirPath}: ${error.message}`,
    );
    process.exit(1);
  }

  let topStoryIds: number[] = [];
  try {
    console.log(`[FETCH] Getting top story IDs from ${HN_API_BASE_URL}...`);
    const response = await fetch(`${HN_API_BASE_URL}/topstories.json`, {
      headers: { "User-Agent": USER_AGENT },
    });
    if (!response.ok) {
      throw new Error(
        `API request failed with status ${response.status} ${response.statusText}`,
      );
    }
    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error("API response for top stories was not an array.");
    }
    topStoryIds = data as number[];
    console.log(
      `[INFO] Found ${topStoryIds.length} top stories. Processing the top ${STORIES_TO_FETCH}.`,
    );
  } catch (error: any) {
    console.error(`[ERROR] Failed to fetch top story IDs: ${error.message}`);
    process.exit(1);
  }

  const idsToProcess = topStoryIds.slice(0, STORIES_TO_FETCH);
  let successCount = 0;
  let skipCount = 0;

  for (let i = 0; i < idsToProcess.length; i++) {
    const id = idsToProcess[i];
    const progress = `(${i + 1}/${idsToProcess.length})`;
    console.log(`\n[INFO] ${progress} Processing story ID: ${id}`);
    let storyData: any = null;

    try {
      const itemResponse = await fetch(`${HN_API_BASE_URL}/item/${id}.json`, {
        headers: { "User-Agent": USER_AGENT },
      });
      if (!itemResponse.ok) {
        throw new Error(
          `Failed to fetch item details - Status ${itemResponse.status} ${itemResponse.statusText}`,
        );
      }
      storyData = await itemResponse.json();

      if (!storyData) {
        throw new Error("Received null or invalid data for story item.");
      }

      const storyUrl = storyData.url;
      const storyTitle = storyData.title || "No Title";

      if (!storyUrl) {
        console.log(
          `[SKIP] ${progress} Story ID ${id} ('${storyTitle}') has no URL. Skipping.`,
        );
        skipCount++;
        continue;
      }

      console.log(
        `[FETCH] ${progress} Fetching content for: '${storyTitle}' from ${storyUrl}`,
      );

      const articleResponse = await fetch(storyUrl, {
        headers: { "User-Agent": USER_AGENT, Accept: "text/html,*/*" },
        redirect: "follow",
        signal: AbortSignal.timeout(20000), // Increased timeout slightly for parsing
      });

      if (!articleResponse.ok) {
        throw new Error(
          `Failed to fetch article URL - Status ${articleResponse.status} ${articleResponse.statusText}`,
        );
      }

      const contentType = articleResponse.headers.get("content-type");
      if (!contentType || !contentType.toLowerCase().includes("text/html")) {
        console.log(
          `[SKIP] ${progress} Content at ${storyUrl} is not HTML ('${contentType || "unknown"}'). Skipping.`,
        );
        skipCount++;
        continue;
      }

      const htmlContent = await articleResponse.text();

      // Use Readability to extract main content
      console.log(
        `[INFO] ${progress} Extracting main article content using Readability...`,
      );
      const articleHtml = await extractArticleContent(htmlContent, storyUrl);

      if (!articleHtml || !articleHtml.trim()) {
        console.log(
          `[SKIP] ${progress} Could not extract main article content from ${storyUrl} using Readability. Skipping.`,
        );
        skipCount++;
        continue;
      }

      console.log(
        `[INFO] ${progress} Extracted article content. Converting to Markdown...`,
      );
      let markdownContent = "";
      try {
        markdownContent = turndownService.turndown(articleHtml);
      } catch (turndownError: any) {
        throw new Error(`Turndown conversion failed: ${turndownError.message}`);
      }

      if (!markdownContent.trim()) {
        console.log(
          `[SKIP] ${progress} Markdown conversion resulted in empty content for ${storyUrl}. Skipping.`,
        );
        skipCount++;
        continue;
      }

      markdownContent = `# ${storyTitle}\n\n${markdownContent}`;

      const sanitizedTitle = sanitizeFilename(storyTitle);
      const filename = `${sanitizedTitle}_${id}.md`;
      const filePath = path.join(dumpDirPath, filename);

      try {
        await Bun.write(filePath, markdownContent);
        console.log(`[SAVE] ${progress} Saved Markdown to: ${filePath}`);
        successCount++;
      } catch (writeError: any) {
        console.error(
          `[SKIP] ${progress} Failed to save Markdown file ${filePath}: ${writeError.message}`,
        );
        skipCount++;
        continue;
      }
    } catch (error: any) {
      console.error(
        `[SKIP] ${progress} Failed to process story ID ${id}: ${error.message}`,
      );
      if (storyData?.url) {
        console.error(`[SKIP] ${progress} Context URL: ${storyData.url}`);
      }
      if (error.name === "TimeoutError") {
        console.error(`[SKIP] ${progress} Request timed out.`);
      }
      skipCount++;
      continue;
    }
  }

  console.log(
    `\n[INFO] Script finished. Successfully saved: ${successCount}. Skipped: ${skipCount}.`,
  );
}

// --- Run Main Function ---
main().catch((err) => {
  console.error(
    "\n[FATAL] An unexpected error occurred outside the main processing loop:",
    err,
  );
  process.exit(1);
});
