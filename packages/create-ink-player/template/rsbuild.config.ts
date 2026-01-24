import { defineConfig } from "@rsbuild/core";
import { pluginImageCompress } from "@rsbuild/plugin-image-compress";
import { pluginPreact } from "@rsbuild/plugin-preact";
import { pluginSass } from "@rsbuild/plugin-sass";
import { pluginSvgr } from "@rsbuild/plugin-svgr";

export default defineConfig({
    output: {
        assetPrefix: "auto",
    },
    dev: {
        hmr: false,
    },
    tools: {
        rspack(_config, { addRules }) {
            addRules([
                {
                    test: /\.ink$/,
                    use: ["@lamppost/ink-player/ink-loader"],
                },
            ]);
        },
    },
    resolve: {
        alias: {
            react: "preact/compat",
            "react-dom/test-utils": "preact/test-utils",
            "react-dom": "preact/compat",
            "react/jsx-runtime": "preact/jsx-runtime",
        },
    },
    plugins: [
        pluginPreact(),
        pluginSass(),
        pluginSvgr(),
        pluginImageCompress(),
    ],
});
