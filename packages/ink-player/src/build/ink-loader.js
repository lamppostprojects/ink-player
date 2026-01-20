import fs from "node:fs";
import path from "node:path";

import { Compiler, CompilerOptions } from "inkjs/full";

export default function (source) {
    const fileName = this.resourcePath;
    const baseDir = path.dirname(fileName);

    // Load imported ink files
    const options = new CompilerOptions(null, [], false, null, {
        ResolveInkFilename: (filename) => {
            return path.resolve(baseDir, filename);
        },
        LoadInkFileContents: (filename) => {
            // Make sure that Rspack knows about the dependency so that it
            // can rebuild the game when the imported file changes.
            this.addDependency(filename);
            return fs.readFileSync(filename, "utf8");
        },
    });

    const story = new Compiler(source, options).Compile();
    return `module.exports = ${story.ToJson()}`;
}
