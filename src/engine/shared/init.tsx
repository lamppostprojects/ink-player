import { NuqsAdapter } from "nuqs/adapters/react";
import { render } from "preact";

import App from "../app/App";
import achievementsPlugin from "../widgets/Achievements";
import backButtonPlugin from "../widgets/BackButton";
import backgroundMusicPlugin from "../widgets/BackgroundMusic";
import cardPlugin from "../widgets/Card";
import commentPlugin from "../widgets/Comment";
import diceRollPlugin from "../widgets/DiceRoll";
import footnotePlugin from "../widgets/Footnotes";
import glossaryPlugin from "../widgets/Glossary";
import headerImagePlugin from "../widgets/HeaderImage";
import imagePlugin from "../widgets/Image";
import locationPlugin from "../widgets/Location";
import portraitPlugin from "../widgets/Portrait";
import textInputPlugin from "../widgets/TextInput";
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
    registerWidget(
        imagePlugin({
            images: settings.widgets?.images ?? {},
        })(settings),
    );
    registerWidget(textInputPlugin({})(settings));
    registerWidget(
        headerImagePlugin({
            images: settings.widgets?.headerImage ?? {},
        })(settings),
    );
    registerWidget(locationPlugin({})(settings));
    registerWidget(
        portraitPlugin({
            images: settings.widgets?.portrait ?? {},
        })(settings),
    );
    registerWidget(
        diceRollPlugin({
            images: settings.widgets?.diceRoll ?? {},
        })(settings),
    );
    registerWidget(
        achievementsPlugin({
            achievements: settings.widgets?.achievements ?? {},
        })(settings),
    );
    registerWidget(
        cardPlugin({
            images: settings.widgets?.card?.images ?? {},
        })(settings),
    );
    registerWidget(glossaryPlugin({})(settings));
    registerWidget(footnotePlugin({})(settings));
    registerWidget(
        backButtonPlugin({
            enabled: settings.widgets?.backButton?.enabled,
        })(settings),
    );
    registerWidget(
        commentPlugin({
            enabled: settings.widgets?.comment?.enabled ?? false,
        })(settings),
    );
    registerWidget(
        backgroundMusicPlugin({
            audioFiles: settings.widgets?.backgroundMusic ?? {},
        })(settings),
    );

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
