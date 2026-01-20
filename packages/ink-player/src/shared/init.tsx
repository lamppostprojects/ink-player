import { NuqsAdapter } from "nuqs/adapters/react";
import { render } from "preact";

import App from "../app/App";
import { setSettings } from "./settings";
import type { IncomingSettings } from "./types";

export const init = (settings: IncomingSettings) => {
    setSettings(settings);

    // Enable the theme
    let defaultTheme = "light";
    const userSetTheme = window.localStorage.getItem(
        `${settings.gameName}-theme`,
    );
    if (userSetTheme) {
        defaultTheme = userSetTheme;
    } else if (settings.defaultTheme) {
        defaultTheme = settings.defaultTheme;
    } else if (settings.enableDarkMode) {
        defaultTheme = window.matchMedia?.("(prefers-color-scheme: dark)")
            .matches
            ? "dark"
            : "light";
    }
    document.documentElement.setAttribute("data-bs-theme", defaultTheme);

    const root = document.getElementById("root");

    if (root) {
        render(
            <NuqsAdapter>
                <App />
            </NuqsAdapter>,
            root,
        );
    }
};
