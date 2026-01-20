import { memoize } from "es-toolkit";

import { getUseStoryStore } from "./game-state";
import { getUseSavedGamesStore } from "./saved-games";
import { getSettings } from "./settings";
import type { PluginRegistry, Settings } from "./types";

export const createPlugin = <T>(
    plugin: (props: {
        settings: T;
        gameSettings: Settings;
        useStoryStore: ReturnType<typeof getUseStoryStore>;
        useSavedGamesStore: ReturnType<typeof getUseSavedGamesStore>;
    }) => PluginRegistry | null,
) => {
    return (pluginSettings: T) => {
        return (gameSettings: Settings) => {
            const useStoryStore = getUseStoryStore();
            const useSavedGamesStore = getUseSavedGamesStore();
            return plugin({
                settings: pluginSettings,
                gameSettings,
                useStoryStore,
                useSavedGamesStore,
            });
        };
    };
};

export const getPluginsByType = memoize(
    <T extends keyof PluginRegistry>(
        methodName: T,
    ): Map<string, NonNullable<PluginRegistry[T]>> => {
        const plugins = getSettings().plugins ?? [];
        const entries: Array<[string, NonNullable<PluginRegistry[T]>]> = [];
        for (const pluginSettings of plugins) {
            const method =
                methodName in pluginSettings
                    ? pluginSettings[methodName as keyof typeof pluginSettings]
                    : null;
            if (method !== null && method !== undefined) {
                entries.push([
                    pluginSettings.type,
                    method as NonNullable<PluginRegistry[T]>,
                ]);
            }
        }
        return new Map(entries);
    },
);
