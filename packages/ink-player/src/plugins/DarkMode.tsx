import Nav from "react-bootstrap/Nav";
import { createPlugin } from "../shared/plugins";
import { useCallback, useEffect, useState } from "preact/hooks";
import MoonIcon from "bootstrap-icons/icons/moon.svg?react";
import SunIcon from "bootstrap-icons/icons/sun.svg?react";

interface DarkModeSettings {
    defaultTheme?: string;
}

export default createPlugin<DarkModeSettings>(({ gameSettings }) => {
    let defaultTheme = "light";
    const userSetTheme = window.localStorage.getItem(
        `${gameSettings.gameName}-theme`,
    );
    if (userSetTheme) {
        defaultTheme = userSetTheme;
    } else if (gameSettings.defaultTheme) {
        defaultTheme = gameSettings.defaultTheme;
    } else {
        defaultTheme = window.matchMedia?.("(prefers-color-scheme: dark)")
            .matches
            ? "dark"
            : "light";
    }
    document.documentElement.setAttribute("data-bs-theme", defaultTheme);

    return ({
        type: "dark-mode",
        nav() {
            const [theme, setTheme] = useState(
                document.documentElement.getAttribute("data-bs-theme") ||
                gameSettings.defaultTheme ||
                "light",
            );
            const toggleTheme = useCallback(() => {
                //setExpanded(false);
                setTheme(theme === "light" ? "dark" : "light");
            }, [theme]);

            useEffect(() => {
                document.documentElement.setAttribute("data-bs-theme", theme);
                window.localStorage.setItem(`${gameSettings.gameName}-theme`, theme);
            }, [theme]);

            return (<Nav.Link onClick={toggleTheme}>
                {theme === "dark" ? (
                    <SunIcon className="bi bi-sun" />
                ) : (
                    <MoonIcon className="bi bi-moon" />
                )}{" "}
                {theme === "dark"
                    ? "Light Mode"
                    : "Dark Mode"}
            </Nav.Link>);
        },
    })
});
