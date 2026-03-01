import type { Widget } from "./types";

const extractInput = (line: string) => {
    const input: Record<string, string> = {};
    const regex = /([\w-]+)="((?:[^"\\]|\\.)*)"/g;

    do {
        const match = regex.exec(line);
        if (match) {
            input[match[1]] = match[2];
        } else {
            break;
        }
        // biome-ignore lint/correctness/noConstantCondition: ...
    } while (true);

    return input;
};

export const parseWidget = (
    line: string,
): string | Widget | Array<string | Widget> => {
    if (line.includes("!widget:")) {
        const type = /!widget:([\w-]+)/.exec(line)?.[1];
        if (!type) {
            return [line];
        }
        const input = extractInput(line);

        return {
            type,
            input,
        };
    }

    const widgets: Array<string | Widget> = [];
    const parts = line.split(/\[widget:/);

    for (const part of parts) {
        if (part.length === 0) {
            continue;
        }

        const match = /^([\w-]+)(.*?)\](.*?)\[\/widget:\1\](.*$)/g.exec(part);

        if (!match) {
            widgets.push(part);
            continue;
        }

        const type = match[1];
        const input = extractInput(match[2]);
        input.contents = match[3];
        widgets.push({
            type,
            input,
        } satisfies Widget);

        const rest = match[4];
        if (rest) {
            widgets.push(rest);
        }
    }

    if (widgets.length === 0) {
        return line;
    }

    return widgets;
};
