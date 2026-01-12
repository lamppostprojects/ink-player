import { NuqsAdapter } from "nuqs/adapters/react";
import { render } from "preact";

import App from "../app/App";
import { achievementsWidget } from "../widgets/Achievements";
import { backButtonWidget } from "../widgets/BackButton";
import { backgroundMusicWidget } from "../widgets/BackgroundMusic";
import { cardWidget } from "../widgets/Card";
import { commentWidget } from "../widgets/Comment";
import { diceRollWidget } from "../widgets/DiceRoll";
import { footnoteWidget } from "../widgets/Footnotes";
import { glossaryWidget } from "../widgets/Glossary";
import { headerImageWidget } from "../widgets/HeaderImage";
import { imageWidget } from "../widgets/Image";
import { locationWidget } from "../widgets/Location";
import { portraitWidget } from "../widgets/Portrait";
import { textInputWidget } from "../widgets/TextInput";
import { setSettings } from "./settings";
import type { Settings } from "./types";
import { registerWidget } from "./widgets";

import "../app/styles.scss";

export const init = (settings: Settings) => {
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

    // Register widgets
    registerWidget(imageWidget);
    registerWidget(textInputWidget);
    registerWidget(headerImageWidget);
    registerWidget(locationWidget);
    registerWidget(portraitWidget);
    registerWidget(diceRollWidget);
    registerWidget(achievementsWidget);
    registerWidget(cardWidget);
    registerWidget(glossaryWidget);
    registerWidget(footnoteWidget);
    registerWidget(backButtonWidget);
    registerWidget(commentWidget);
    registerWidget(backgroundMusicWidget);

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
