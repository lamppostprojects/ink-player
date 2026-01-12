import type { Settings } from "./types";

let settings: Settings | null = null;

export const getSettings = () => {
    if (!settings) {
        throw new Error("Settings not set");
    }
    return settings;
};

export const setSettings = (newSettings: Settings) => {
    settings = newSettings;
};
