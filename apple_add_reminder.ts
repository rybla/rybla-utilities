#!/usr/bin/env bun

import { execSync } from "child_process";
import { parseArgs } from "util"; // Node.js built-in module for arg parsing

/**
 * Interface defining the properties for a new reminder.
 */
interface ReminderOptions {
  title: string; // The main text of the reminder (required).
  listName?: string; // The name of the list to add the reminder to. Defaults to the default Reminders list.
  body?: string; // Additional notes for the reminder.
  due?: string; // The due date for the reminder.
}

/**
 * Creates a new reminder in the Apple Reminders app.
 * @param options - An object containing the details for the reminder.
 */
function createReminder(options: ReminderOptions): void {
  // console.log("Creating reminder with options:", options);

  const { title, listName, body, due } = options;

  // --- Construct the AppleScript command ---
  let properties = `name:"${escapeStringForAppleScript(title)}"`;
  if (body) {
    properties += `, body:"${escapeStringForAppleScript(body)}"`;
  }
  if (due) {
    const appleScriptDate = `date "${due}"`;
    properties += `, due date:${appleScriptDate}`;
  }

  const targetList = listName
    ? `list "${escapeStringForAppleScript(listName)}"`
    : "default list";

  const appleScriptCommand = `
tell application "Reminders"
  tell ${targetList}
    make new reminder with properties {${properties}}
  end tell
end tell
  `.trim();

  // console.log(`\`\`\`applescript\n${appleScriptCommand}\n\`\`\``);

  // --- Execute the AppleScript command ---
  try {
    console.log(`Attempting to create reminder: "${title}"...`);
    execSync(`osascript -e '${appleScriptCommand}'`);
    let confirmationMsg = `Successfully created reminder: "${title}" in list "${listName || "Default"}"`;
    if (due) {
      confirmationMsg += ` due "${due}"`;
    }
    console.log(confirmationMsg + ".");
  } catch (error) {
    console.error(`Failed to create reminder: "${title}".`);
    if (error instanceof Error) {
      console.error("Error:", error.message);
      if ("stderr" in error && error.stderr) {
        console.error("Stderr:", error.stderr.toString());
      }
      if ("stdout" in error && error.stdout) {
        console.error("Stdout:", error.stdout.toString());
      }
    } else {
      console.error("An unknown error occurred:", error);
    }
    console.error(
      "\nEnsure Reminders app is installed, the list (if specified) exists, and permissions are granted.",
    );
    process.exit(1); // Exit with error code
  }
}

/**
 * Helper function to escape double quotes and backslashes for AppleScript strings.
 * @param input - The string to escape.
 * @returns The escaped string.
 */
function escapeStringForAppleScript(input: string): string {
  if (!input) return "";
  return input.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

// --- Main execution logic for CLI ---

function printUsage(): void {
  console.log(`
Usage: apple_add_reminder <title> [options]

Creates a new Apple Reminder.

Arguments:
  title             The required title of the reminder (enclose in quotes if it contains spaces).

Options:
  -l, --listName    Specify the Reminders list (defaults to the default list).
  -b, --body        Add optional notes to the reminder.
  -d, --due         Set a due date for the reminder.
  -h, --help        Display this help message.

Examples:
  apple_add_reminder "Buy milk"
  apple_add_reminder "Schedule meeting" -l Work -b "Discuss Q3 results"
  apple_add_reminder "Project due" -d "December 12, 2025"
  apple_add_reminder "Team Lunch" -d "December 20, 2025 at 12:30"
  apple_add_reminder "Call back Sarah" -d "December 1, 3 PM"
    `);
}

try {
  // Define the expected command-line arguments
  const optionsConfig = {
    listName: { type: "string", short: "l" },
    body: { type: "string", short: "b" },
    due: { type: "string", short: "d" }, // Parse date as string first
    help: { type: "boolean", short: "h" },
  } as const;

  // Parse the arguments provided via Bun
  const { values, positionals } = parseArgs({
    args: Bun.argv.slice(2),
    options: optionsConfig,
    allowPositionals: true,
    strict: true,
  });

  // Check for help flag
  if (values.help) {
    printUsage();
    process.exit(0);
  }

  // The first positional argument is the required title
  const title = positionals[0];

  // Validate that the title was provided
  if (!title) {
    console.error("Error: Reminder title is required.\n");
    printUsage();
    process.exit(1);
  }

  // Prepare the options for the createReminder function
  const reminderOptions: ReminderOptions = {
    title: title,
    listName: values.listName,
    body: values.body,
    due: values.due,
  };

  // Call the function to create the reminder
  createReminder(reminderOptions);
} catch (err: any) {
  // Catch errors from parseArgs (e.g., unknown options)
  console.error("Argument parsing error:", err.message);
  printUsage();
  process.exit(1);
}
