import { init } from "./engine/shared/init";
import achievementsPlugin from "./engine/widgets/Achievements";
import backButtonPlugin from "./engine/widgets/BackButton";
import backgroundMusicPlugin from "./engine/widgets/BackgroundMusic";
import cardPlugin from "./engine/widgets/Card";
import commentPlugin from "./engine/widgets/Comment";
import diceRollPlugin from "./engine/widgets/DiceRoll";
import footnotePlugin from "./engine/widgets/Footnotes";
import glossaryPlugin from "./engine/widgets/Glossary";
import headerImagePlugin from "./engine/widgets/HeaderImage";
import imagePlugin from "./engine/widgets/Image";
import locationPlugin from "./engine/widgets/Location";
import portraitPlugin from "./engine/widgets/Portrait";
import textInputPlugin from "./engine/widgets/TextInput";
import screens from "./story/screens";
import settings from "./story/settings";

import "./story/styles.scss";

if (!settings.plugins) {
    settings.plugins = [
        settings.widgets?.images
            ? imagePlugin({
                  images: settings.widgets.images,
              })
            : null,
        textInputPlugin({}),
        settings.widgets?.headerImage
            ? headerImagePlugin({
                  images: settings.widgets.headerImage,
              })
            : null,
        locationPlugin({}),
        settings.widgets?.portrait
            ? portraitPlugin({
                  images: settings.widgets.portrait,
              })
            : null,
        settings.widgets?.diceRoll
            ? diceRollPlugin({
                  images: settings.widgets.diceRoll,
              })
            : null,
        settings.widgets?.achievements
            ? achievementsPlugin({
                  achievements: settings.widgets.achievements,
              })
            : null,
        settings.widgets?.card?.images
            ? cardPlugin({
                  images: settings.widgets.card.images,
              })
            : null,
        glossaryPlugin({}),
        footnotePlugin({}),
        settings.widgets?.backButton?.enabled ? backButtonPlugin({}) : null,
        settings.widgets?.comment?.enabled ? commentPlugin({}) : null,
        settings.widgets?.backgroundMusic
            ? backgroundMusicPlugin({
                  audioFiles: settings.widgets.backgroundMusic,
              })
            : null,
    ];
}

init({ ...settings, screens });
