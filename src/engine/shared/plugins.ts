import { getUseStoryStore } from "./game-state";
import { getUseSavedGamesStore } from "./saved-games";
import type { Settings, WidgetRegistry } from "./types";

export const createPlugin = <T>(
    plugin: (props: {
        settings: T;
        gameSettings: Settings;
        useStoryStore: ReturnType<typeof getUseStoryStore>;
        useSavedGamesStore: ReturnType<typeof getUseSavedGamesStore>;
    }) => WidgetRegistry | null,
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
