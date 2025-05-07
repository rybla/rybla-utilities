Implement `extractFeedUrls` in the following context:

```ts
import { parseString } from "xml2js";
import fs from "fs/promises";

/** Extracts feed URLs from an OPML file */
async function extractFeedUrls(feed_filepath: string): Promise<string[]> {
  // TODO
}
```

Make sure to:
- use `async/await` style
- handle errors gracefully
- log informative messages to the console while processing
