/**
 * Hacker News Comments to Markdown Exporter
 *
 * This script fetches the comments from a Hacker News post and saves them as a Markdown file.
 *
 * How it works:
 * 1.  Setup: Defines TypeScript interfaces for the Hacker News API item structure.
 * 2.  Input Parsing: Reads the Hacker News post URL from the command line arguments using `Bun.argv`. It validates the input and extracts the post ID.
 * 3.  API Fetching:
 * - `fetchItem(id)`: Fetches data for a specific Hacker News item (post or comment) using its ID. It includes basic error handling for the fetch request.
 * - It first fetches the main post data to get the title and the top-level comment IDs (`kids`).
 * 4.  Markdown Conversion:
 * - `formatCommentToMarkdown(comment, level)`: This recursive function takes a comment object and its nesting level. It fetches the full comment data using `fetchItem`. It then formats the comment text (converting basic HTML like <p> to newlines and handling HTML entities) and recursively calls itself for any child comments (`kids`), increasing the indentation level for the Markdown output. Deleted or dead comments are skipped.
 * 5.  File Operations:
 * - `sanitizeFilename(name)`: Removes characters that are typically invalid in filenames to create a safe filename from the post title.
 * - The script constructs the full Markdown content string, starting with the post title as a header.
 * - It iterates through the top-level comment IDs, calling `formatCommentToMarkdown` for each to build the nested comment structure.
 * - `Bun.write()`: Writes the generated Markdown string to a file named `[sanitized_post_title].md`.
 * 6.  Execution: The main part of the script orchestrates these steps, calling the functions in order and logging the final output filename or any errors encountered.
 *
 * Usage:
 * bun run hn-comments-to-md.ts <hacker_news_post_url>
 * Example:
 * bun run hn-comments-to-md.ts https://news.ycombinator.com/item?id=40153598
 */

import { argv } from "bun";
import { decode } from "html-entities";

interface HNItem {
  id: number;
  deleted?: boolean;
  type?: "job" | "story" | "comment" | "poll" | "pollopt";
  by?: string;
  time?: number;
  text?: string;
  dead?: boolean;
  parent?: number;
  poll?: number;
  kids?: number[];
  url?: string;
  score?: number;
  title?: string;
  parts?: number[];
  descendants?: number;
}

const HN_API_BASE_URL = "https://hacker-news.firebaseio.com/v0";

function sanitizeFilename(name: string): string {
  return name.replace(/[\/\\?%*:|"<>]/g, "-").replace(/\s+/g, "_");
}

async function fetchItem(id: number): Promise<HNItem | null> {
  try {
    const response = await fetch(`${HN_API_BASE_URL}/item/${id}.json`);
    if (!response.ok) {
      console.error(`Error fetching item ${id}: ${response.statusText}`);
      return null;
    }
    const item = (await response.json()) as HNItem;
    return item;
  } catch (error) {
    console.error(`Network error fetching item ${id}:`, error);
    return null;
  }
}

function formatHtmlText(html?: string): string {
  if (!html) return "";
  // Basic HTML conversion: <p> -> newlines, decode entities
  // More complex parsing could be added here if needed.
  let text = html.replace(/<p>/g, "\n\n").replace(/<[^>]+>/g, ""); // Remove other tags
  return decode(text).trim(); // Decode entities like &amp; etc.
}

async function formatCommentToMarkdown(
  commentId: number,
  level: number,
): Promise<string> {
  const comment = await fetchItem(commentId);
  if (!comment || comment.deleted || comment.dead || !comment.text) {
    return "";
  }

  const indent = "  ".repeat(level * 2); // Indentation for nesting
  let markdown = `${indent}- **${comment.by ?? "unknown"}**:\n`;
  const formattedText = formatHtmlText(comment.text);
  // Add indentation to each line of the comment text
  markdown +=
    formattedText
      .split("\n")
      .map((line) => `${indent}  ${line}`)
      .join("\n") + "\n\n";

  let childMarkdown = "";
  if (comment.kids && comment.kids.length > 0) {
    const childPromises = comment.kids.map((kidId) =>
      formatCommentToMarkdown(kidId, level + 1),
    );
    const childResults = await Promise.all(childPromises);
    childMarkdown = childResults.join("");
  }

  return markdown + childMarkdown;
}

async function main() {
  const args = argv.slice(2);
  if (args.length !== 1) {
    console.error("Usage: bun run hn-comments-to-md.ts <hacker_news_post_url>");
    process.exit(1);
  }

  const urlString = args[0];
  let postId: number | null = null;

  try {
    const url = new URL(urlString!);
    if (url.hostname !== "news.ycombinator.com" || url.pathname !== "/item") {
      throw new Error("Invalid Hacker News item URL.");
    }
    const idParam = url.searchParams.get("id");
    if (!idParam || isNaN(parseInt(idParam, 10))) {
      throw new Error("Could not find valid item ID in URL.");
    }
    postId = parseInt(idParam, 10);
  } catch (error) {
    console.error(
      `Error parsing URL: ${error instanceof Error ? error.message : error}`,
    );
    process.exit(1);
  }

  if (postId === null) {
    console.error("Failed to extract post ID.");
    process.exit(1);
  }

  console.log(`Fetching post data for ID: ${postId}...`);
  const post = await fetchItem(postId);

  if (!post || post.type !== "story") {
    console.error(
      `Could not fetch post data or item with ID ${postId} is not a story.`,
    );
    process.exit(1);
  }

  const postTitle = post.title ?? `HN_Post_${postId}`;
  const filename = `${sanitizeFilename(postTitle)}.md`;

  console.log(`Fetching comments for "${postTitle}"...`);
  let markdownContent = `# ${postTitle}\n\n`;
  markdownContent += `Link: ${urlString}\n\n`;
  markdownContent += `## Comments\n\n`;

  if (post.kids && post.kids.length > 0) {
    const commentPromises = post.kids.map((kidId) =>
      formatCommentToMarkdown(kidId, 0),
    );
    const commentResults = await Promise.all(commentPromises);
    markdownContent += commentResults.join("");
  } else {
    markdownContent += "*No comments found.*\n";
  }

  try {
    console.log(`Writing comments to ${filename}...`);
    await Bun.write(filename, markdownContent);
    console.log(`Successfully saved comments to ${filename}`);
  } catch (error) {
    console.error(`Error writing file ${filename}:`, error);
    process.exit(1);
  }
}

main();
