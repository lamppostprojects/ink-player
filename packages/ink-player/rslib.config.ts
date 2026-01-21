import { pluginPreact } from "@rsbuild/plugin-preact";
import { pluginSass } from "@rsbuild/plugin-sass";
import { pluginSvgr } from "@rsbuild/plugin-svgr";
import { defineConfig } from "@rslib/core";

export default defineConfig({
    plugins: [pluginPreact(), pluginSvgr(), pluginSass()],
    lib: [
        {
            dts: true,
            format: "esm",
            syntax: "es2021",
            bundle: false,
        },
    ],
    output: {
        target: "web",
    },
});
