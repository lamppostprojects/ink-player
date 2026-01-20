import type { GameState, IncomingSettings } from "@lamppost/ink-player";
import LockFillIcon from "bootstrap-icons/icons/sunset.svg?react";

//import ThemeA from "./assets/audio/balanors-theme.mp3";
//import ThemeB from "./assets/audio/garden-of-flowers.mp3";
import CatfishImage from "../assets/images/1855-catfish.jpg";
import CatfishImageLarge from "../assets/images/1855-catfish-large.jpg";
import Destruction1 from "../assets/images/1923-destruction1.jpg";
import Destruction2 from "../assets/images/1923-destruction2.jpg";
import Fire1 from "../assets/images/1923-fire1.jpg";
import Fire1Large from "../assets/images/1923-fire1-large.jpg";
import Fire2 from "../assets/images/1923-fire2.jpg";
import Fire2Large from "../assets/images/1923-fire2-large.jpg";
import FirstAid from "../assets/images/1923-firstaid.jpg";
import FirstAidLarge from "../assets/images/1923-firstaid-large.jpg";
import Refugee from "../assets/images/1923-refugee.jpg";
import RefugeeLarge from "../assets/images/1923-refugee-large.jpg";
import Teaching from "../assets/images/1923-teaching.jpg";
import TeachingLarge from "../assets/images/1923-teaching-large.jpg";
import Tent from "../assets/images/1923-tent.jpg";
import TentLarge from "../assets/images/1923-tent-large.jpg";
import Dice1 from "../assets/images/dice/d4_1.gif";
import Dice2 from "../assets/images/dice/d4_2.gif";
import Dice3 from "../assets/images/dice/d4_3.gif";
import Dice4 from "../assets/images/dice/d4_4.gif";
import MapImage from "../assets/images/map.jpg";
import { About } from "./About";
import { Glossary } from "./Glossary";
import { References } from "./References";

export default {
    /**
     * The name of the game. It will be used in the following ways:
     * - As the title of the browser tab
     * - As the name of the game in the header (if no shortGameName is provided)
     * - As the ID for storing the saved games in the browser's local storage
     */
    gameName: "Lamp Post Player",

    /**
     * Load the JSON version of the Ink story. Change this to point to your
     * own story file.
     */
    loadStory: () => import("../game/yoshiwara.ink"),

    defaultTheme: "dark",
    enableDarkMode: true,
    enableGameScreen: true,
    enableKeyboardInput: true,

    screens: [
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
        {
            id: "glossary",
            title: "Glossary",
            component: Glossary,
        },
        {
            id: "references",
            title: "References",
            component: References,
        },
        {
            id: "achievements",
            title: "Achievements",
            component: "achievements",
        },
    ],

    /**
     * The short name of the game. It will be used as the name of the game
     * in the header. If not provided, the gameName will be used.
     */
    // shortGameName: "LampPost Player",

    /**
     * Whether to enable dark mode. If not provided, dark mode will not be
     * enabled. If enabled, it will turn on the toggle in the header,
     * load the user's preference from their computer, and store the result
     * in the browser's local storage.
     */
    // enableDarkMode: false,

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
    stickyTags: [
        "Portrait",
        "Image",
        "Chapter Title",
        "Location",
        "BackgroundMusic",
    ],

    /**
     * Configuration for shared widgets.
     */
    widgets: {
        /**
         * Images to be used in the header for a knot. Can be configured
         * by setting the "Image:Name" tag in your Ink story. The "Name"
         * value will be used to match one of the images defined here.
         * You will need to import the image above like so:
         *     import Foyer from "./assets/images/foyer.jpg";
         */
        // headerImage: {
        //     Foyer: Foyer,
        // },
        /**
         * Portrait images to be displayed inside a knot. Can be configured
         * by setting the "Portrait:Name" tag in your Ink story. The "Name"
         * value will be used to match one of the portraits defined here.
         * You will need to import the image above like so:
         *     import Rion from "./assets/images/rion.jpg";
         *     import RionLarge from "./assets/images/rion large.jpg";
         * The large image is displayed in a modal when the user clicks on
         * the small image, and is optional.
         */
        // portrait: {
        //     Rion: {
        //         small: Rion,
        //         large: RionLarge,
        //     },
        // },
        /**
         * Images to be displayed inline inside a knot. Can be configured by
         * putting !widget:image markup in your Ink story. You will need to
         * import the image above like so:
         *     import MapImage from "./assets/images/map.jpg";
         *     import MapImageLarge from "./assets/images/map large.jpg";
         * The large image is displayed in a modal when the user clicks on
         * the small image, and is optional.
         *
         * The exact markup to use is:
         *     !widget:image name="Map" alt="A map of the game." align="left"
         * The name should match the name of the image you want to display.
         * The alt text is optional, and will be used as the alt text for the
         * image (but should be provided for accessibility reasons).
         * The align property is optional, and can be "left", "right", or "center".
         * The default is "center". Left or right will float the image and allow
         * the text to flow around it.
         */
        images: {
            Catfish: {
                small: CatfishImage,
                large: CatfishImageLarge,
            },
            Fire1: {
                small: Fire1,
                large: Fire1Large,
            },
            Fire2: {
                small: Fire2,
                large: Fire2Large,
            },
            Destruction1: {
                small: Destruction1,
                large: Destruction1,
            },
            Destruction2: {
                small: Destruction2,
                large: Destruction2,
            },
            FirstAid: {
                small: FirstAid,
                large: FirstAidLarge,
            },
            Refugee: {
                small: Refugee,
                large: RefugeeLarge,
            },
            Tent: {
                small: Tent,
                large: TentLarge,
            },
            Teaching: {
                small: Teaching,
                large: TeachingLarge,
            },
        },
        "dice-roll": {
            d4: {
                "1": Dice1,
                "2": Dice2,
                "3": Dice3,
                "4": Dice4,
            },
        },
        //achievements: {
        //    Start: {
        //        icon: MapImage,
        //        title: "Start",
        //        description: "Start the game.",
        //        hidden: true,
        //        showHiddenButtonText: "View Locked Achievement",
        //    },
        //    "Sitting Room": {
        //        icon: MapImage,
        //        title: "Sitting Room",
        //        description: "Enter the sitting room.",
        //        hidden: true,
        //        showHiddenButtonText: "View Locked Achievement",
        //    },
        //    "Dining Room": {
        //        icon: MapImage,
        //        title: "Dining Room",
        //        description: "Enter the dining room.",
        //        hidden: true,
        //    },
        //    Kitchen: {
        //        icon: LockFillIcon,
        //        title: "Kitchen",
        //        description: "Enter the kitchen.",
        //        hidden: false,
        //    },
        //},
        card: {
            map: MapImage,
            lock: LockFillIcon,
        },
        //comment: {
        //    enabled: true,
        //},
        backButton: {
            enabled: true,
        },
        history: {
            groupBy: (currentState: GameState) => ({
                id: currentState.tags.Location,
                title: currentState.tags.Location ?? "Unknown Location",
            }),
        },
        //backgroundMusic: {
        //    ThemeA: ThemeA,
        //    ThemeB: ThemeB,
        //},
    },
} as IncomingSettings;
