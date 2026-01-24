# Lamp Post Player

This is a web player for running [Ink](https://github.com/inkle/ink) stories created by [Lamp Post Projects](https://lamppostprojects.com/).

## Getting Started

* Run `pnpm dev` to see the result in your browser and confirm that things are running correctly.
* Open up `story/game.ink` in the Inky editor and make modifications, go back to your game in the browser and see your changes live!
* Update the settings in `src/index.tsx` to use your game name and update any other settings.
* Update the About page in `src/About.tsx` to include some information about your game (or remove that page entirely by updating `src/index.ts`).
* Add any custom CSS styling inside the `src/styles.scss` file.
* Run `pnpm build` to create the final HTML/JS/CSS/Image files needed to display the game. The files will be output to the `dist/` directory. You can then bundle them or upload them to the location of your choice.
* To update your game to the latest version of the ink player you can run `pnpm update-ink-player`.

## Next Steps

Please see [@lamppost/ink-player](https://www.npmjs.com/package/@lamppost/ink-player) for more details on how to configure the Lamp Post Ink Player
