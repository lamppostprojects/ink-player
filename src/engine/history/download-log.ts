import settings from "../../story/settings";
import type { GameState, Widget } from "../shared/types";
import { logWidgets } from "../shared/widgets";

const renderLogLine = (
    line: string | Widget | Array<string | Widget>,
): string | null => {
    if (Array.isArray(line)) {
        return `<p>${line
            .map((part) => renderLogLine(part))
            .filter(Boolean)
            .join("")}</p>`;
    }

    if (typeof line === "string") {
        return `<p>${line}</p>`;
    }

    const Widget = logWidgets.get(line.type);
    if (Widget) {
        return Widget({
            input: line.input,
            output: line.output,
        });
    }

    return null;
};

const renderChoice = (
    choice: string | Widget | Array<string | Widget>,
): string | null => {
    if (Array.isArray(choice)) {
        return `<p><strong>&raquo; ${choice
            .map((part) => renderChoice(part))
            .filter(Boolean)
            .join("")}</strong></p>`;
    }

    if (typeof choice === "string") {
        return `<p><strong>&raquo; ${choice}</strong></p>`;
    }

    const Widget = logWidgets.get(choice.type);
    if (Widget) {
        return Widget({
            input: choice.input,
            output: choice.output,
        });
    }

    return null;
};

export const downloadHTMLLog = (gameState: GameState[]) => {
    const { shortGameName, gameName } = settings;
    const contents = gameState
        .map((state) => {
            let text = state.lines
                .map((line) => renderLogLine(line))
                .join("\n");
            if (state.selectedChoice != null) {
                text += `\n${renderChoice(state.choices[state.selectedChoice].choice)}`;
            }
            return text;
        })
        .join("\n<hr />\n");
    const html = `<html><body><h1>${gameName} Log</h1>
    <p><i>Downloaded on ${new Date().toLocaleString()}</i></p>
    ${contents}</body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${shortGameName || gameName}-log-${new Date().toISOString()}.html`;
    a.click();
};
