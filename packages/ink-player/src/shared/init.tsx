import { NuqsAdapter } from "nuqs/adapters/react";
import { render } from "preact";

import App from "../app/App";
import { setSettings } from "./settings";
import type { IncomingSettings } from "./types";

export const init = (settings: IncomingSettings) => {
    // Set the default theme
    const defaultTheme = settings.defaultTheme || "light";
    document.documentElement.setAttribute("data-bs-theme", defaultTheme);

    setSettings(settings);

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
