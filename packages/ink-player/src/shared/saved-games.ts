import { memoize } from "es-toolkit";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { getSettings } from "./settings";
import type { SavedGame } from "./types";

/**
 * Check to see if the current page is in a cross-origin iframe.
 */
const isInCrossOriginIframe = () => {
    try {
        return window.self.location.origin !== window.top?.location.origin;
    } catch (_e) {
        // If there's an error, assume we're in a cross-origin iframe as
        // we don't have access to the top window.
        return true;
    }
};

/**
 * Safari and Firefox do not allow storing to localStorage when
 * inside a cross-origin iframe.
 */
const disallowsCrossOriginSaves = () => {
    return (
        (navigator.userAgent.includes("Safari") &&
            !navigator.userAgent.includes("Chrome")) ||
        navigator.userAgent.includes("Firefox")
    );
};

export const getUseSavedGamesStore = memoize(() =>
    create<{
        savedGames: SavedGame[];
        getMostRecentSavedGame: () => SavedGame | null;
        setSavedGames: (savedGames: SavedGame[]) => void;
        addSavedGame: (savedGame: SavedGame) => void;
        deleteSavedGame: (savedGameId: string) => void;
        canSaveInLocalStorage: () => boolean;
        autosave: (
            getSaveState: (props: {
                id: string;
                title: string;
            }) => SavedGame | null,
        ) => void;
    }>()(
        persist(
            (set, get) => ({
                savedGames: [],
                getMostRecentSavedGame: () =>
                    get().savedGames[get().savedGames.length - 1],
                setSavedGames: (savedGames: SavedGame[]) => set({ savedGames }),
                addSavedGame: (savedGame: SavedGame) =>
                    set({
                        savedGames: [...(get().savedGames || []), savedGame],
                    }),
                deleteSavedGame: (savedGameId: string) =>
                    set({
                        savedGames: get().savedGames?.filter(
                            (savedGame) => savedGame.id !== savedGameId,
                        ),
                    }),
                canSaveInLocalStorage: () =>
                    !isInCrossOriginIframe() || !disallowsCrossOriginSaves(),
                autosave: (
                    getSaveState: (props: {
                        id: string;
                        title: string;
                    }) => SavedGame | null,
                ) => {
                    const {
                        canSaveInLocalStorage,
                        addSavedGame,
                        deleteSavedGame,
                    } = get();
                    if (!canSaveInLocalStorage()) {
                        return;
                    }
                    const saveState = getSaveState({
                        id: "autosave",
                        title: "Autosave",
                    });
                    if (saveState) {
                        deleteSavedGame("autosave");
                        addSavedGame(saveState);
                    }
                },
            }),
            {
                name: `${getSettings().gameName}-savedGames`,
                version: 6,
                storage: createJSONStorage(() => ({
                    getItem: (name) => localStorage.getItem(name),
                    setItem: (name, value) => {
                        try {
                            localStorage.setItem(name, value);
                        } catch (error) {
                            console.error(
                                "Error saving game to localStorage",
                                error,
                            );
                            window.alert(
                                "Error saving game to your browser's storage. You may need to remove some saved games to free up space and then try again.",
                            );
                        }
                    },
                    removeItem: (name) => localStorage.removeItem(name),
                })),
                partialize(state) {
                    // We only want to save to saved game state, but not the
                    // story data because it's too large to store in the
                    // browser's storage.
                    return {
                        savedGames: state.savedGames.map((savedGame) => ({
                            ...savedGame,
                            gameState: savedGame.gameState.map(
                                ({ storyData, ...state }) => ({
                                    ...state,
                                }),
                            ),
                        })),
                    };
                },
                migrate(persistedState: any, version) {
                    if (!version || version < 6) {
                        return {
                            ...persistedState,
                            savedGames: persistedState.savedGames.map(
                                (savedGame: any) => ({
                                    ...savedGame,
                                    gameState: savedGame.gameState.map(
                                        ({ tags, ...state }: any) => ({
                                            ...state,
                                            tags:
                                                typeof tags === "string"
                                                    ? [tags]
                                                    : tags,
                                        }),
                                    ),
                                }),
                            ),
                        };
                    }

                    // Make it so that choices now have access to their tags
                    if (!version || version < 2) {
                        return {
                            ...persistedState,
                            savedGames: persistedState.savedGames.map(
                                (savedGame: any) => ({
                                    ...savedGame,
                                    choices: savedGame.choices.map(
                                        (choice: any) => ({ choice, tags: {} }),
                                    ),
                                }),
                            ),
                        };
                    }
                    return persistedState;
                },
            },
        ),
    ),
);
