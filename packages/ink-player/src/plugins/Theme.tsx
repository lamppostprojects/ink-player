import { useEffect } from "preact/hooks";

import { createPlugin } from "../shared/plugins";

interface ThemeSettings {
    defaultTheme?: string;
    tag?: string;
}

export default createPlugin<ThemeSettings>(({ settings }) => {
    if (settings.defaultTheme) {
        document.documentElement.setAttribute(
            "data-theme",
            settings.defaultTheme,
        );
    }

    const tag = settings.tag || "Theme";

    return {
        type: "theme",
        header({ context, currentState }) {
            if (context === "history") {
                return null;
            }

            const theme =
                currentState.tags[tag]?.[0] || settings.defaultTheme || null;

            useEffect(() => {
                if (theme) {
                    document.documentElement.setAttribute("data-theme", theme);
                } else {
                    document.documentElement.removeAttribute("data-theme");
                }
            }, [theme]);

            return null;
        },
        key({ currentState }) {
            return currentState.tags[tag]?.[0] || null;
        },
    };
});
