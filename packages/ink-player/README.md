# Lamp Post Ink Player

This is a web player for running [Ink](https://github.com/inkle/ink) stories created by [Lamp Post Projects](https://lamppostprojects.com/).

> [!WARNING]
> This software still under active development, please use with caution as it's likely to change.

## Getting Started

Requirements: [Node.js](https://nodejs.org/) and [pnpm](https://pnpm.io/).

* Run `pnpm create ink-player@latest`
* Inside your terminal, go into the new project directory that you just created.
* Run `pnpm install`.
* Run `pnpm dev` to see the result in your browser and confirm that things are running correctly.
* Open up `story/game.ink` in the Inky editor and make modifications, go back to your game in the browser and see your changes live!
* Update the settings in `src/index.ts` to use your game name and update any other settings.
* Update the About page in `src/About.tsx` to include some information about your game (or remove that screen entirely by updating `src/index.ts`).
* Add any custom CSS styling inside the `src/styles.scss` file.
* Run `pnpm build` to create the final HTML/JS/CSS/Image files needed to display the game. The files will be output to the `dist/` directory. You can then bundle them or upload them to the location of your choice.

## Custom Features

The Lamp Post Ink Player includes a number of custom tags and markup that be used to show special features exclusive to this player.

### Disabled Choices

Individual choices can be disabled by adding a `# disabled` tag within the choice. It will make it so that the choice cannot be selected by the user.

### Sticky Tags

The Lamp Post Ink Player has the ability to "persist" tags defined in knots to future knots. This can help to simplify some of the configuration of some tags used by features (such as Location, ImageHeader, etc.). If you wish to turn "off" a persisted tag then you can set the tag to be "None", like so: `# Location:None`.

To make a tag sticky, in `src/index.ts`:

```
stickyTags: ["Location"],
```

### Themes & Dark Mode

By default the display will use the built-in Bootstrap light theme. You can override this by setting `defaultTheme: "dark"` in the `src/index.ts` file.

Additionally, you can set `enableDarkMode: true` to use whatever the user's preferred theme is (which is configured via their operating system). The user will also be presented with a way to configure the theme in the page header. If the user chooses an option here it will override any specified `defaultTheme`.

### Page Configuration

You can configure which pages are shown in the sidebar and in what order they are displayed. These are displayed in the sidebar and in the header (on mobile).

There are two built-in screens: "Game" and "History". Those must have the id of "game" and "history", respectively, but can have custom titles. The only required screen is "Game".

You can reorder the screens however you like, the first listed screen will be shown to the user by default.

You can also add custom screens by providing a component. The component will be rendered in a tab, and can be any valid React component.

The component is provided with the following props:

* `setPage`: A function to navigate to a different screen
* `loading`: A boolean indicating if the game is loading

## Plugins

Plugins extend the functionality of the Ink player by providing additional functionality. You can add them in by importing the plugin into your settings file and adding it to the plugins list.

For example, to enable locations, in `src/index.ts` you would do:

```
import locationPlugin from "@lamppost/ink-player/plugins/location"
...
plugins: [
    ...
    locationPlugin({}),
    ...
]
```

### Header Images

Images to be used in the header for a knot. Can be configured by setting the "Image:Name" tag in your Ink story. The "Name" value will be used to match one of the images defined in the `src/index.ts` file.

You'll probably want to specify "Image" as a sticky tag, as well, in order to simplify the display of the header image. More info on Sticky Tags in the section below.

For example, in your Ink file, add the following tag:

```
# Image:Foyer
```

In `src/index.ts`:

```
import Foyer from "./assets/images/foyer.jpg";
import headerImagePlugin from "@lamppost/ink-player/plugins/header"
...
stickyTags: ["Image"],
plugins: [
    ...
    headerImagePlugin({
        images: {
            Foyer: Foyer,
        }
    }),
    ...
]
```

### Locations

Display a textual location at the top of a knot. Can be configured by setting the "Location:Name" tag in your Ink story.

You'll probably want to specify "Location" as a sticky tag, as well, in order to simplify the display of the location across multiple knots. More info on Sticky Tags in the section below.

For example, in your Ink file, add the following tag:

```
# Location:Foyer
```

To enable locations and make them sticky, in `src/index.ts`:

```
import locationPlugin from "@lamppost/ink-player/plugins/location"
...
stickyTags: ["Location"],
plugins: [
    ...
    locationPlugin({}),
    ...
]
```

### Portraits

Portraits to be displayed in a knot. Can be configured by setting the "# Portrait:Name" tag in your Ink story. The "Name" value will be used to match one of the portraits defined in the `src/index.ts` file. If a large image is specified then it'll be shown in a modal when the portrait is clicked.

You'll probably want to specify "Portrait" as a sticky tag, as well, in order to simplify the display of portraits during a long conversation. More info on Sticky Tags in the section below.

For example, in your Ink file, add the following tag:

```
# Portrait:Rion
```

In `src/index.ts`:

```
import Rion from "./assets/images/rion.jpg";
import RionLarge from "./assets/images/rion large.jpg";
import portraitPlugin from "@lamppost/ink-player/plugins/portrait"
...
stickyTags: ["Portrait"],
plugins: [
    ...
    portraitPlugin({
        images: {
            Rion: {
                small: Rion,
                large: RionLarge,
            },
        }
    }),
    ...
]
```

### Background Music

Background music can be played between scenes. Can be configured by setting the "# Background Music:Name" tag in your Ink story. The "Name" value will be used to match one of the music files defined in the `src/index.ts` file.

The volume levels will be controlled via a button in the navbar.

You'll probably want to specify "BackgroundMusic" as a sticky tag, as well, in order to ensure seemless music playback during a long conversation. More info on Sticky Tags in the section below.

For example, in your Ink file, add the following tag:

```
# BackgroundMusic:Name
```

In `src/index.ts`:

```
import ThemeA from "./assets/audio/theme-a.mp3";
import ThemeB from "./assets/audio/theme-b.mp3";
import backgroundMusicPlugin from "@lamppost/ink-player/plugins/background-music";
...
stickyTags: ["BackgroundMusic"],
plugins: [
    ...
    backgroundMusicPlugin({
        audioFiles: {
            ThemeA: ThemeA,
            ThemeB: ThemeB,
        }
    }),
    ...
]
```

### Inline Images

Images to be displayed inline in a knot. Can be configured by using a special `!widget:image` syntax in your Ink story. The "Name" value will be used to match one of the images defined in the `src/index.ts` file. If a large image is specified then it'll be shown in a modal when the portrait is clicked.

The alt text is optional, and will be used as the alt text for the image (but should be provided for accessibility reasons).

The align property is optional, and can be "left", "right", or "center". The default is "center". Left or right will float the image and allow the text to flow around it.

You can add a caption to the image using the "caption" property. If you add a URL in the "source" property then it'll be added as a link to the caption.

For example, in your Ink file, add the following text:

```
!widget:image name="Map" alt="A map of the world..." align="left"
```

In `src/index.ts`:

```
import MapImage from "./assets/images/map.jpg";
import MapImageLarge from "./assets/images/map large.jpg";
import imagePlugin from "@lamppost/ink-player/plugins/image";
...
plugins: [
    ...
    imagePlugin({
        images: {
            Map: {
                small: Map,
                large: MapLarge,
            },
        }
    }),
    ...
]
```

### Text Input

A text input to be displayed inside a choice. Can be configured by using a special `!widget:text-input` syntax in a choice in your Ink story. Can be enable in your settings by doing:

```
import textInputPlugin from "@lamppost/ink-player/plugins/text-input";
...
plugins: [
    ...
    textInputPlugin({}),
    ...
]
```

The text input widget has the following props:

* `name` (required): This corresponds with the Ink variable that the result will be written to whenever the user submits their answer.
* `label` (required): The label to set on the input, to help inform the user about what is being asked of them.
* `input-label` (optional, default: "Submit"): The label to set on the submit button.

For example, in your Ink file, add the following text as one of your choices:

```
!widget:text-input name="name-var" label="Your Name" submit-label="Set Name"
```

### Card Choices

A card to be displayed inside a choice. Can be configured by using a special `!widget:card` syntax in a choice in your Ink story.

The card widget has the following props:

* `title` (required): The primary text of the choice that will be displayed both in the game and in the history/logs.
* `description` (optional): Additional contextual text to help guide the user towards making a decision.
* `icon` (optional): The image to use on the side of the card. Can be a path to an image or a React component/SVG.

For example, in your Ink file, add the following text as one of your choices:

```
!widget:card icon="library" title="Visit the Library"
```

To add any card images, in `src/index.ts`:

```
import LibraryImage from "./assets/images/library.jpg";
import SunIcon from "bootstrap-icons/icons/sun.svg?react";
import cardPlugin from "@lamppost/ink-player/plugins/card";
...
plugins: [
    ...
    cardPlugin({
        images: {
            "library": LibraryImage,
            "sun": SunIcon,
        }
    }),
    ...
]
...
```

### Achievements

Achievements are a way to reward users with successfully accessing parts of the ink file. They can be triggered by adding a `# Achievement:all-endings` tag in your game (replacing `all-endings` with the name of your achievement).

To add an achievement, in `src/index.ts`:

```
import MapImage from "./assets/images/map.jpg";
import SunIcon from "bootstrap-icons/icons/sun.svg?react";
import achievementsPlugin from "@lamppost/ink-player/plugins/achievements";
...
plugins: [
    ...
    achievementsPlugin({
        achievements: {
            "all-endings": {
                icon: MapImage,
                title: "All Endings",
                description: "Complete all the endings of the game.",
                hidden: true,
                showHiddenButtonText: "View Locked Achievement",
            },
            "new-day": {
                icon: SunIcon,
                title: "Reach a New Day",
                description: "Start a new day.",
            },
        },
    }),
    ...
],
```

The properties for configuring an achievement are as follows:

* `icon`: Can be a path to an image or a React component which renders an image.
* `title`: The name of the achievement to display to the user.
* `description` (optional): The description of the achievement to display to the user.
* `hidden` (optional, defaults to `false`): Should this achievement be hidden on the achievements page?
* `showHiddenButtonText` (optional): If the achievement is `hidden` then a button will be overlaid on it, with this text in it, which a user can click to reveal the hidden achievement.

Additionally in `src/index.ts` you'll want to add an Achievements page:

```
screens: [
    ...
    {
        id: "achievements",
        title: "Achievements",
        component: "achievements",
    },
    ...
],
```

### Dice Rolls

A widget for displaying the results of a die roll. Doesn't actually perform a roll itself, instead it's a mechanism for displaying a non-looping die roll gif and delaying the display of all text and choices after the die roll (for dramatic effect).

You can insert a die roll into a page using:

```
!widget:dice-roll die="d4" value="1" alt="A 1 on a 4-sided die"
```

The options are as follows:

* `die` (required): The type of die being rolled (used to look up the right image).
* `value` (required): The face of the die (used to look up the right image).
* `alt` (required): The text used for screen readers and also for display in the game history and logs.
* `duration` (optional, default `1500`): How long to delay the display of all subsequent text and choices. Set to `"0"` to have no delay.

To configure the images to use in `src/index.ts`:

```
import Dice1 from "./assets/images/dice/d4_1.gif";
import Dice2 from "./assets/images/dice/d4_2.gif";
import Dice3 from "./assets/images/dice/d4_3.gif";
import Dice4 from "./assets/images/dice/d4_4.gif";
import diceRollPlugin from "@lamppost/ink-player/plugins/diceRoll";
...
plugins: [
    ...
    diceRollPlugin({
        images: {
            d4: {
                "1": Dice1,
                "2": Dice2,
                "3": Dice3,
                "4": Dice4,
            },
        },
    }),
    ...
]
```

### Glossary

If you add a function into your game file with the name like:

```
=== function glossary_word ===
A definition of the word.
```

Then it'll automatically find all instances of that word in the game text and make them clickable to view the definition of the word as a popover.

To enable this in `src/index.ts`:

```
import glossaryPlugin from "@lamppost/ink-player/plugins/glossary";
...
plugins: [
    ...
    glossaryPlugin({}),
    ...
]
```

### Comments

You can make it so that play testers can leave comments inside their transcript for future analysis.

You can turn this feature on by enabling this setting in `src/index.ts`:

```
import commentPlugin from "@lamppost/ink-player/plugins/comment";
...
plugins: [
    ...
    commentPlugin({}),
    ...
]
```

The results will show up in the game, history, and the downloaded HTML log.

### Footnotes

You can add collapsible footnotes that will display beneath the choices. You can add a footnote inside your content by doing:

```
[widget:footnote]The contents of your footnote.[/widget:footnote]
```

If you want to add a small linkable id that the user can click to visit the footnote, then do:

```
[widget:footnote id="1" link="true"]The contents of your footnote.[/widget:footnote]
```

You can turn this feature on by enabling this setting in `src/index.ts`:

```
import footnotesPlugin from "@lamppost/ink-player/plugins/footnotes";
...
plugins: [
    ...
    footnotesPlugin({}),
    ...
]
```

The results will show up in the game, history, and the downloaded HTML log.

## Credits and License

* The prototype version of this software was created by Nell Shaw Cohen for use in the games [The Secrets of Sylvan Gardens](https://lamppostprojects.com/the-secrets-of-sylvan-gardens), [Fantasy Opera: Mischief at the Masquerade](https://lamppostprojects.com/fantasy-opera), and [The Path of Totality](https://lamppostprojects.com/the-path-of-totality).
* This version of the web player was created by John Resig.

This software is released under an MIT license.
