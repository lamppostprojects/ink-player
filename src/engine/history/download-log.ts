import { getPluginsByType } from "../shared/plugins";
import { getSettings } from "../shared/settings";
import type { GameState, Widget } from "../shared/types";

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

    const Widget = getPluginsByType("log").get(line.type);
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
        return choice
            .map((part) => renderChoice(part))
            .filter(Boolean)
            .join("");
    }

    if (typeof choice === "string") {
        return `<p><strong>&raquo; ${choice}</strong></p>`;
    }

    const Widget = getPluginsByType("log").get(choice.type);
    if (Widget) {
        return Widget({
            input: choice.input,
            output: choice.output,
        });
    }

    return null;
};

const renderState = (state: GameState) => {
    let text = "";

    for (const log of getPluginsByType("log").values()) {
        text += log({
            currentState: state,
            location: "header",
        });
    }

    text += state.lines.map((line) => renderLogLine(line)).join("\n");

    if (state.selectedChoice != null) {
        text += `\n${renderChoice(state.choices[state.selectedChoice].choice)}`;
    }

    for (const log of getPluginsByType("log").values()) {
        text += log({
            currentState: state,
            location: "footer",
        });
    }

    return text;
};

export const downloadHTMLLog = (gameState: GameState[]) => {
    const settings = getSettings();
    const { shortGameName, gameName } = settings;
    const contents = gameState.map(renderState).join("\n<hr />\n");
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
