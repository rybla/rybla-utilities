// Or use the built-in fetch for Node.js v18+
// If using built-in fetch and ES Modules, ensure "type": "module" is in your package.json
// No import needed for built-in fetch.

// Define an interface for the Hacker News Item (Story)
interface HNStory {
  id: number;
  title: string;
  url?: string; // URL might not be present for Ask HN posts, etc.
  score: number;
  by: string;
  time: number; // Unix timestamp
  type: "story" | "job" | "comment" | "poll" | "pollopt";
  descendants?: number; // Comment count
  kids?: number[]; // IDs of top-level comments
}

const HACKER_NEWS_API_BASE_URL = "https://hacker-news.firebaseio.com/v0";
const MAX_STORIES_TO_FETCH = 20; // How many top stories to fetch details for

/**
 * Fetches the IDs of the current top stories from Hacker News.
 * @returns A promise that resolves to an array of story IDs.
 */
async function getTopStoryIds(): Promise<number[]> {
  const url = `${HACKER_NEWS_API_BASE_URL}/topstories.json`;
  console.log(`Workspaceing top story IDs from ${url}...`);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const storyIds = (await response.json()) as number[];
    console.log(`Workspaceed ${storyIds.length} top story IDs.`);
    return storyIds;
  } catch (error) {
    console.error("Error fetching top story IDs:", error);
    return []; // Return empty array on error
  }
}

/**
 * Fetches the details of a specific Hacker News item by its ID.
 * @param id The ID of the item to fetch.
 * @returns A promise that resolves to the story details or null if an error occurs or item is not a story.
 */
async function getItemDetails(id: number): Promise<HNStory | null> {
  const url = `${HACKER_NEWS_API_BASE_URL}/item/${id}.json`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      // Don't throw for individual item errors, just log and return null
      console.error(
        `HTTP error fetching item ${id}! status: ${response.status}`,
      );
      return null;
    }
    const item = (await response.json()) as HNStory;
    // Ensure it's a story type before returning
    return item && item.type === "story" ? item : null;
  } catch (error) {
    console.error(`Error fetching details for item ${id}:`, error);
    return null; // Return null on error
  }
}

/**
 * Main function to get and display today's top Hacker News posts.
 */
async function getTodaysBestPosts() {
  console.log(
    `Workspaceing the top ${MAX_STORIES_TO_FETCH} Hacker News posts for today (${new Date().toLocaleDateString()})...`,
  );

  const topStoryIds = await getTopStoryIds();

  if (topStoryIds.length === 0) {
    console.log("Could not retrieve top story IDs. Exiting.");
    return;
  }

  // Get the IDs for the stories we actually want to fetch details for
  const idsToFetch = topStoryIds.slice(0, MAX_STORIES_TO_FETCH);
  console.log(`Workspaceing details for ${idsToFetch.length} stories...`);

  // Fetch details for the selected stories concurrently
  const storyPromises = idsToFetch.map((id) => getItemDetails(id));
  const stories = (await Promise.all(storyPromises)).filter(
    (story): story is HNStory => story !== null,
  ); // Filter out nulls and type guard

  console.log("\n--- Today's Top Hacker News Posts ---");
  if (stories.length > 0) {
    stories.forEach((story, index) => {
      console.log(`${index + 1}. ${story.title}`);
      console.log(`   Score: ${story.score} | By: ${story.by}`);
      console.log(`   URL: ${story.url ?? "N/A (e.g., Ask HN)"}`);
      console.log(
        `   Discussion: https://news.ycombinator.com/item?id=${story.id}`,
      );
      console.log("---");
    });
  } else {
    console.log("No stories found or could not fetch details.");
  }
}

// Run the main function
getTodaysBestPosts();
