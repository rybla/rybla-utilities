Write a script using TypeScript and the [Bun](https://bun.sh) runtime that does the following:

  - Use the `parseArgs` from the `util` module to parse the following command line arguments:
    - `--days`: A positive integer number of days.
    - `--feed`: A filepath to a `.opml` file.
  - Validate the inputs.
    - `days` must be a positive integer.
    - `feed` must be a valid `.opml` filepath.
  - Let `feed_name` be `feed` but just the base name and without the file extension.
  - Create a directory called `${feed_name}_{date_start}_${date_end}` where `date_start` is the current date minus `days` number of days, and `end_date` is the current date. Call this directory `dump`.
  - Use `fast-xml-parser` to parse the OPML file and extract the URLs of the feeds.
  - For each feed:
    - Fetch the feed URL and use the `rss-parser` library to parse the feed information.
    - List the titles and URLs of all articles that were published within the last `days` days.
    - For each article, download the HTML for that article.
    - Use the `@mozilla/readability` library to extract just the human-friendly article content from the HTML.
    - Use the `turndown` library to convert that extracted content into Markdown. Make sure that the Markdown begins with "# " followed by the title of the article.
    - Save the Markdown as a file in `dumpDir`. It's name should be the safely-escaped `title` of the article.

Keep the following points in mind:
- Use `console.log` to report to the user what's going on as the script is running. Use nice formatting
- Handle all error cases properly. If something unexpected happens, report what the error was and continue running if possible. For example, if fetching the HTML for a post or parsing it or anything like that fails, just skip that post.
