import type { IncomingSettings, Settings } from "./types";

let settings: Settings | null = null;

export const getSettings = () => {
    if (!settings) {
        throw new Error("Settings not set");
    }
    return settings;
};

export const setSettings = (newSettings: IncomingSettings) => {
    // Do an initial set of the settings so that the plugins have
    // something to work with on initial load
    settings = { ...newSettings, plugins: [] };

    // Then initialize all of the plugins
    settings = {
        ...newSettings,
        plugins:
            newSettings.plugins
                ?.map((plugin) => plugin?.(newSettings as unknown as Settings))
                .filter(
                    (pluginSettings) =>
                        pluginSettings !== null && pluginSettings !== undefined,
                ) ?? [],
    };
};
