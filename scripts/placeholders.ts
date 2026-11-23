// Lists every placeholder text, data entry and image with the page that
// uses it. Run with `npm run placeholders`.
import { contentSources, images } from "../src/content/index.ts";
import { formatPlaceholders, listPlaceholders } from "../src/content/placeholders.ts";

console.log(formatPlaceholders(listPlaceholders(contentSources, images)));
