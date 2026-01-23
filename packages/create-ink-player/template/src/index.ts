import { init } from "@lamppost/ink-player";
import locationPlugin from "@lamppost/ink-player/plugins/location";
import textInputPlugin from "@lamppost/ink-player/plugins/text-input";
import historyPlugin from "@lamppost/ink-player/plugins/history";
import darkModePlugin from "@lamppost/ink-player/plugins/dark-mode";

import "@lamppost/ink-player/styles.css";
import "./styles.scss";

import { About } from "./About";

init({
    /**
     * The name of the game. It will be used in the following ways:
     * - As the title of the browser tab
     * - As the name of the game in the header (if no shortGameName is provided)
     * - As the ID for storing the saved games in the browser's local storage
     */
    gameName: "Lamp Post Player",

    /**
     * Load the Ink story. Change this to point to your own story file.
     */
    loadStory: () => import("../story/game.ink"),

    /**
     * The short name of the game. It will be used as the name of the game
     * in the header. If not provided, the gameName will be used.
     */
    // shortGameName: "LampPost Player",

    /**
     * The default theme to use. If not provided, the default theme will be
     * "light".
     */
    // defaultTheme: "light",

    /**
     * The favicon of the game. If not provided, no favicon will be used.
     * This should point to a favicon image file. The import would look
     * something like:
     *   import Favicon from "./assets/images/icon.svg";
     */
    // favicon: Favicon,

    /**
     * The default name of the save file. If not provided, the save file
     * will be named "Untitled Save". This should be a function that takes
     * the current state of the game and returns a string.
     */
    // defaultSaveName: (currentState) =>
    //     `${currentState.tags["Chapter Title"] ?? "Untitled Chapter"}: ${currentState.tags.Location ?? "Unknown Location"}`,

    /**
     * Any tags that should persist between knots. Providing a tag here will
     * ensure that things like portraits (for example) will still be visible
     * even if they are not explicitly mentioned in the knot.
     * You can stop a sticky tag from persisting by setting it to "None" in
     * your Ink story.
     */
    // stickyTags: ["Portrait", "Location", "BackgroundMusic"],

    /**
     * The pages to display in the game. The only required page is "Game".
     */
    pages: [
        {
            id: "home",
            title: "Home",
            component: About,
        },
        {
            id: "game",
            title: "Story",
            component: "Game",
        },
        {
            id: "history",
            title: "History",
            component: "History",
        },
    ],

    /**
     * The plugins to use in the game.
     *
     * You can add more plugins by importing them from the @lamppost/ink-player package.
     *
     * For example, to add the location plugin, you would do:
     *   import locationPlugin from "@lamppost/ink-player/plugins/location";
     *   plugins: [textInputPlugin({}), locationPlugin({})],
     */
    plugins: [
        textInputPlugin({}),
        locationPlugin({}),
        historyPlugin({}),
        darkModePlugin({}),
    ],
});
