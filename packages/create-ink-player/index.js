#!/usr/bin/env node
import { execSync } from "node:child_process";
import {
    cpSync,
    existsSync,
    mkdirSync,
    readFileSync,
    renameSync,
    rmSync,
    writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { stdin as input, stdout as output } from "node:process";
import readline from "node:readline/promises";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
    const incomingName = process.argv[2];

    // Ask for the directory name
    const rl = readline.createInterface({ input, output });

    let directoryName = incomingName || "";
    while (directoryName.length === 0) {
        const answer = await rl.question(
            "What directory name would you like to use? ",
        );
        const trimmed = answer.trim();

        if (!trimmed || trimmed.length === 0) {
            console.log("Directory name cannot be empty");
            continue;
        }

        // Check for valid directory name characters
        if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
            console.log(
                "Directory name can only contain letters, numbers, hyphens, and underscores",
            );
            continue;
        }

        directoryName = trimmed;
        break;
    }

    const targetDir = resolve(process.cwd(), directoryName);

    // Check if directory already exists
    if (existsSync(targetDir)) {
        console.error(`Error: Directory "${directoryName}" already exists.`);
        process.exit(1);
    }

    // Ask for the game name
    let gameName = incomingName || "";
    while (gameName.length === 0) {
        const answer = await rl.question("What is the name of your game? ");
        const trimmed = answer.trim();

        if (!trimmed || trimmed.length === 0) {
            console.log("Game name cannot be empty");
            continue;
        }

        gameName = trimmed;
        break;
    }

    rl.close();

    console.log(`Creating game "${gameName}"...`);

    // Create the directory
    mkdirSync(targetDir, { recursive: true });

    // Copy template contents
    const templateDir = join(__dirname, "template");
    console.log("Copying template files...");
    cpSync(templateDir, targetDir, { recursive: true });

    // Rename _gitignore to .gitignore file
    const gitignorePath = join(targetDir, "_gitignore");
    renameSync(gitignorePath, join(targetDir, ".gitignore"));

    // Delete the node_modules directory, if it exists
    if (existsSync(join(targetDir, "node_modules"))) {
        rmSync(join(targetDir, "node_modules"), { recursive: true });
    }

    // Update package.json
    const packageJsonPath = join(targetDir, "package.json");
    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
    packageJson.name = directoryName;
    writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);

    // Update the gameName in the src/index.ts file
    const indexTsPath = join(targetDir, "src/index.ts");
    const indexTs = readFileSync(indexTsPath, "utf-8").replace(
        "Lamp Post Player",
        gameName,
    );
    writeFileSync(indexTsPath, indexTs);

    // Update the gameName in the README.md file
    const readmeMdPath = join(targetDir, "README.md");
    const readmeMd = readFileSync(readmeMdPath, "utf-8").replace(
        "Lamp Post Player",
        gameName,
    );
    writeFileSync(readmeMdPath, readmeMd);

    if (incomingName) {
        console.log("Skipping installation and update of ink-player...");
        console.log(`\nTo get started:`);
        console.log(`  cd ${directoryName}`);
        console.log(`  pnpm install`);
        console.log(`  pnpm update-ink-player`);
        console.log(`  pnpm dev`);
        console.log(
            `\nThis will start the development server and open the game in your browser. You can now start working on your game.`,
        );
        process.exit(0);
    }

    console.log("Installing dependencies...");

    // Run pnpm install
    try {
        execSync("pnpm install", {
            cwd: targetDir,
            stdio: "inherit",
        });
    } catch (error) {
        console.error("Error installing dependencies:", error.message);
        process.exit(1);
    }

    // Run pnpm update-ink-player
    try {
        execSync("pnpm update-ink-player", {
            cwd: targetDir,
            stdio: "inherit",
        });
    } catch (error) {
        console.error("Error updating ink-player:", error.message);
    }

    console.log(`\n${gameName} setup complete!`);
    console.log(`\nTo get started:`);
    console.log(`  cd ${directoryName}`);
    console.log(`  pnpm dev`);
    console.log(
        `\nThis will start the development server and open the game in your browser.`,
    );
}

main().catch((error) => {
    console.error("Error:", error.message);
    process.exit(1);
});
