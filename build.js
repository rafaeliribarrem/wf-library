const esbuild = require("esbuild");
const CleanCSS = require("clean-css");
const fs = require("fs");
const path = require("path");

const SRC = "src";
const DIST = "dist";
const isWatch = process.argv.includes("--watch");

function findFiles(dir, exts) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...findFiles(full, exts));
    else if (exts.some(e => entry.name.endsWith(e))) results.push(full);
  }
  return results;
}

async function buildJS() {
  const entryPoints = findFiles(SRC, [".js"]);
  if (!entryPoints.length) return;

  await esbuild.build({
    entryPoints: ["src/core/init.js"],
    outfile: path.join(DIST, "wf-library.min.js"),
    bundle: true,
    minify: true,
    sourcemap: false,
    target: ["es2020"],
    format: "iife",
  });
  console.log("  JS: dist/wf-library.min.js (bundle)");

  for (const file of entryPoints) {
    const outfile = file.replace(SRC, DIST).replace(".js", ".min.js");
    await esbuild.build({
      entryPoints: [file],
      outfile,
      bundle: false,
      minify: true,
      sourcemap: false,
      target: ["es2020"],
      format: "iife",
    });
    console.log("  JS: " + outfile);
  }
}

function buildCSS() {
  const cssFiles = findFiles(SRC, [".css"]);
  if (!cssFiles.length) return;
  const cleanCSS = new CleanCSS({ level: 2 });

  const combined = cssFiles.map(f => fs.readFileSync(f, "utf8")).join("\n");
  const bundleResult = cleanCSS.minify(combined);
  const bundlePath = path.join(DIST, "wf-library.min.css");
  fs.mkdirSync(path.dirname(bundlePath), { recursive: true });
  fs.writeFileSync(bundlePath, bundleResult.styles);
  console.log("  CSS: dist/wf-library.min.css (bundle)");

  for (const file of cssFiles) {
    const outfile = file.replace(SRC, DIST).replace(".css", ".min.css");
    const outDir = path.dirname(outfile);
    fs.mkdirSync(outDir, { recursive: true });
    const result = cleanCSS.minify(fs.readFileSync(file, "utf8"));
    if (result.errors.length) { console.error("  CSS ERROR: " + file, result.errors); continue; }
    fs.writeFileSync(outfile, result.styles);
    console.log("  CSS: " + outfile);
  }
}

async function build() {
  console.log("\n  Building wf-library...\n");
  if (fs.existsSync(DIST)) fs.rmSync(DIST, { recursive: true });
  fs.mkdirSync(DIST, { recursive: true });
  await buildJS();
  buildCSS();
  console.log("\n  Build complete!\n");
}

if (isWatch) {
  console.log("  Watching for changes...\n");
  build();
  fs.watch(SRC, { recursive: true }, (_, filename) => {
    if (filename && /\.(js|css)$/.test(filename)) {
      console.log("\n  Changed: " + filename);
      build();
    }
  });
} else {
  build();
}
