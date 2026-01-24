#!/usr/bin/env node

import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Paths relative to this script
const rootDir = join(__dirname, "../..");
const inkPlayerPackageJson = join(rootDir, "packages/ink-player/package.json");
const templatePackageJson = join(__dirname, "template/package.json");
const templateDir = join(__dirname, "template");

// Read ink-player package.json to get the version
const inkPlayerPackage = JSON.parse(
    readFileSync(inkPlayerPackageJson, "utf-8"),
);
const inkPlayerVersion = inkPlayerPackage.version;

console.log(`Found ink-player version: ${inkPlayerVersion}`);

// Read template package.json
const templatePackage = JSON.parse(readFileSync(templatePackageJson, "utf-8"));

// Update the @lamppost/ink-player dependency version
if (templatePackage.dependencies?.["@lamppost/ink-player"]) {
    const oldVersion = templatePackage.dependencies["@lamppost/ink-player"];
    templatePackage.dependencies["@lamppost/ink-player"] =
        `^${inkPlayerVersion}`;
    console.log(
        `Updated @lamppost/ink-player from ${oldVersion} to ^${inkPlayerVersion}`,
    );
} else {
    console.error(
        "Error: @lamppost/ink-player dependency not found in template package.json",
    );
    process.exit(1);
}

// Write updated template package.json
writeFileSync(
    templatePackageJson,
    `${JSON.stringify(templatePackage, null, 4)}\n`,
);
console.log("Updated template/package.json");

// Run pnpm install --ignore-workspace in the template directory
console.log("Running pnpm install --ignore-workspace in template directory...");
try {
    execSync("pnpm install --ignore-workspace", {
        cwd: templateDir,
        stdio: "inherit",
    });
    console.log("Successfully updated template dependencies!");
} catch (error) {
    console.error("Error running pnpm install:", error.message);
    process.exit(1);
}
