import type { Settings, WidgetRegistry } from "./types";

export const createPlugin = <T>(
    plugin: (
        pluginSettings: T,
        gameSettings: Settings,
    ) => WidgetRegistry | null,
): ((
    pluginSettings: T,
) => (gameSettings: Settings) => WidgetRegistry | null) => {
    return (pluginSettings) => (gameSettings: Settings) =>
        plugin(pluginSettings, gameSettings);
};
