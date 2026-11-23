
import { readFile, writeFile } from "node:fs/promises";
import { transform } from "esbuild";

const scripts = [
  "scripts/nav.js",
  "scripts/footer.js",
  "scripts/sidebar-menu.js",
  "scripts/utils.js",
  "scripts/register.js",
  "scripts/subHeader.js"
];

// Combine JavaScript in loader.js order
const sources = await Promise.all(
  scripts.map(file => readFile(file, "utf8"))
);

const combined = sources.join("\n;\n");

// Minify JavaScript
const js = await transform(combined, {
  loader: "js",
  minify: true,
  target: "es2020"
});

await writeFile("enrole.min.js", js.code);

// Minify CSS
const cssSource = await readFile("style.css", "utf8");

const css = await transform(cssSource, {
  loader: "css",
  minify: true
});

await writeFile("style.min.css", css.code);

console.log("✅ Enrole production files generated!");
