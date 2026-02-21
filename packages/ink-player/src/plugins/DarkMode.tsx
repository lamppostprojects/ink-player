import MoonIcon from "bootstrap-icons/icons/moon.svg?react";
import SunIcon from "bootstrap-icons/icons/sun.svg?react";
import { useCallback } from "preact/hooks";
import Nav from "react-bootstrap/Nav";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { createPlugin } from "../shared/plugins";

interface DarkModeSettings {
    defaultTheme?: string;
}

export default createPlugin<DarkModeSettings>(({ gameSettings }) => {
    const useDarkModeStore = create<{
        theme: string;
        setTheme: (theme: string) => void;
    }>()(
        persist(
            (set, get) => {
                let theme = "light";
                const userTheme = get()?.theme;
                if (userTheme) {
                    theme = userTheme;
                } else if (gameSettings.defaultTheme) {
                    theme = gameSettings.defaultTheme;
                } else {
                    theme = window.matchMedia?.("(prefers-color-scheme: dark)")
                        .matches
                        ? "dark"
                        : "light";
                }

                return {
                    theme,
                    setTheme: (theme: string) => set({ theme }),
                };
            },
            {
                name: `${gameSettings.gameName}-dark-mode`,
            },
        ),
    );

    document.documentElement.setAttribute(
        "data-bs-theme",
        useDarkModeStore.getState().theme,
    );

    useDarkModeStore.subscribe((state) => {
        document.documentElement.setAttribute("data-bs-theme", state.theme);
    });

    return {
        type: "dark-mode",
        export() {
            return useDarkModeStore.getState().theme;
        },
        import(data) {
            useDarkModeStore.setState({ theme: data as string });
        },
        nav() {
            const theme = useDarkModeStore((state) => state.theme);
            const setTheme = useDarkModeStore((state) => state.setTheme);
            const toggleTheme = useCallback(() => {
                //setExpanded(false);
                setTheme(theme === "light" ? "dark" : "light");
            }, [theme]);

            return (
                <Nav.Link onClick={toggleTheme}>
                    {theme === "dark" ? (
                        <SunIcon className="bi bi-sun" />
                    ) : (
                        <MoonIcon className="bi bi-moon" />
                    )}{" "}
                    {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </Nav.Link>
            );
        },
    };
});
