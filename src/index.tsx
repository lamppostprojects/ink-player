import { NuqsAdapter } from "nuqs/adapters/react";
import { render } from "preact";

import App from "./engine/app/App";
import { registerWidget } from "./engine/shared/widgets";
import { achievementsWidget } from "./engine/widgets/Achievements";
import { backButtonWidget } from "./engine/widgets/BackButton";
import { backgroundMusicWidget } from "./engine/widgets/BackgroundMusic";
import { cardWidget } from "./engine/widgets/Card";
import { commentWidget } from "./engine/widgets/Comment";
import { diceRollWidget } from "./engine/widgets/DiceRoll";
import { footnoteWidget } from "./engine/widgets/Footnotes";
import { glossaryWidget } from "./engine/widgets/Glossary";
import { headerImageWidget } from "./engine/widgets/HeaderImage";
import { imageWidget } from "./engine/widgets/Image";
import { locationWidget } from "./engine/widgets/Location";
import { portraitWidget } from "./engine/widgets/Portrait";
import { textInputWidget } from "./engine/widgets/TextInput";
import settings from "./story/settings";

import "./engine/app/styles.scss";
import "./story/styles.scss";

// Enable the theme
let defaultTheme = "light";
const userSetTheme = window.localStorage.getItem(`${settings.gameName}-theme`);
if (userSetTheme) {
    defaultTheme = userSetTheme;
} else if (settings.defaultTheme) {
    defaultTheme = settings.defaultTheme;
} else if (settings.enableDarkMode) {
    defaultTheme = window.matchMedia?.("(prefers-color-scheme: dark)").matches
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
