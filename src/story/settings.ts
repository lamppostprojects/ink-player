import type { Settings } from "../engine/shared/types";

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
    loadStory: () => import("./demo.ink.json"),

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
    // stickyTags: ["Portrait", "Image", "Chapter Title", "Location"],

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
        // images: {
        //     Map: {
        //         small: MapImage,
        //         large: MapImageLarge,
        //     },
        // },
    },
} as Settings;
