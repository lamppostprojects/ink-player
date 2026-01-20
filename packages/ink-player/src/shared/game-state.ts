import { memoize } from "es-toolkit";
import type { Story } from "inkjs";
import { create } from "zustand";

import { getPluginsByType } from "./plugins";
import { getSettings } from "./settings";
import type { GameState, SavedGame, Widget } from "./types";

export const getUseStoryStore = memoize(() =>
    create<{
        id: string;
        story: Story | null;
        storyJSON: { inkVersion: number } | null;
        Story: typeof Story | null;
        error: string | null;
        _initializing: boolean;
        gameState: GameState[];
        currentState: GameState | null;
        previousState: GameState | null;
        loadStoryData: () => Promise<void>;
        loadSavedGame: (savedGame: SavedGame) => void;
        getSaveState: ({
            title,
            id,
        }: {
            title: string;
            id?: string;
        }) => SavedGame | null;
        startNewGame: () => void;
        updateCurrentState: (currentState: GameState) => void;
        selectChoice: ({
            index,
            output,
            variables,
        }: {
            index: number;
            output?: Record<string, string>;
            variables?: Record<string, string>;
        }) => {
            gameState: GameState[];
            story: Story;
            error: string | null;
        } | null;
        back: () => void;
    }>((set, get) => ({
        id: "",
        story: null,
        storyJSON: null,
        Story: null,
        error: null,
        _initializing: false,
        gameState: [],
        currentState: null,
        previousState: null,
        loadStoryData: async () => {
            const { story, _initializing } = get();
            if (story || _initializing) {
                return;
            }
            set({ _initializing: true });
            const settings = getSettings();
            const [storyJSON, { Story }] = await Promise.all([
                // Load the story data
                settings.loadStory(),

                // Load the inkjs library
                import("inkjs"),

                // Preload the widgets
                ...Array.from(getPluginsByType("preload").values()).map(
                    (preload) => preload(),
                ),
            ]);
            set({
                storyJSON,
                Story,
                id: crypto.randomUUID(),
                _initializing: false,
            });
        },
        startNewGame: () => {
            const { storyJSON, Story } = get();
            if (!storyJSON || !Story) {
                return;
            }
            const story = new Story(storyJSON);
            story.onError = (error) => {
                set({ error });
            };
            for (const handleStoryLoad of getPluginsByType(
                "handleStoryLoad",
            ).values()) {
                handleStoryLoad({ story });
            }

            const newState = getStoryState({
                story,
                currentState: null,
            });

            if (newState) {
                set({
                    id: crypto.randomUUID(),
                    story,
                    gameState: [newState],
                    currentState: newState,
                    previousState: null,
                    error: null,
                });
            }
        },
        loadSavedGame: (savedGame: SavedGame) => {
            const { storyJSON, Story, selectChoice } = get();
            if (!storyJSON || !Story) {
                return;
            }
            const { gameState } = savedGame;
            const story = new Story(storyJSON);
            story.onError = (error) => {
                set({ error });
            };
            for (const handleStoryLoad of getPluginsByType(
                "handleStoryLoad",
            ).values()) {
                handleStoryLoad({ story });
            }

            const currentState = gameState[gameState.length - 1] ?? null;
            const previousState = gameState[gameState.length - 2] ?? null;

            if (
                previousState?.selectedChoice !== undefined &&
                previousState.storyData
            ) {
                story.state.LoadJson(
                    typeof previousState.storyData === "string"
                        ? previousState.storyData
                        : JSON.stringify(previousState.storyData),
                );

                set({
                    id: crypto.randomUUID(),
                    story,
                    gameState: gameState.slice(0, -1) ?? [],
                    currentState: previousState,
                    previousState: null,
                    error: null,
                });

                const selectedChoice =
                    previousState.choices[previousState.selectedChoice];

                selectChoice({
                    index: previousState.selectedChoice,
                    output:
                        typeof selectedChoice.choice === "string" ||
                        !("type" in selectedChoice.choice)
                            ? undefined
                            : selectedChoice.choice.output,
                });

                // Restore widget state from the previous state
                const { currentState: newCurrentState, updateCurrentState } =
                    get();

                if (newCurrentState) {
                    updateCurrentState({
                        ...newCurrentState,
                        widgets: {
                            ...currentState?.widgets,
                        },
                    });
                }
            } else {
                // Remove the hash from the URL
                history.replaceState(
                    null,
                    "",
                    window.location.href.split("#")[0],
                );

                story.state.LoadJson(
                    typeof currentState.storyData === "string"
                        ? currentState.storyData
                        : JSON.stringify(currentState.storyData),
                );
                set({
                    id: crypto.randomUUID(),
                    story,
                    gameState,
                    currentState,
                    previousState,
                    error: null,
                });
            }
        },
        getSaveState: ({ title, id }: { title: string; id?: string }) => {
            const { story, currentState, gameState } = get();
            if (!story || !currentState) {
                return null;
            }
            return {
                id: id ?? crypto.randomUUID(),
                title,
                steps: Math.max(gameState.length - 1, 1),
                date: new Date().toLocaleString(),
                gameState,
            };
        },
        updateCurrentState: (currentState: GameState) => {
            const { gameState } = get();
            set({
                gameState: [...(gameState || []).slice(0, -1), currentState],
                currentState,
            });
        },
        selectChoice: ({
            index,
            output,
            variables,
        }: {
            index: number;
            output?: Record<string, string>;
            variables?: Record<string, string>;
        }) => {
            const { story, currentState, gameState } = get();
            if (!story || !currentState) {
                return null;
            }

            currentState.selectedChoice = index;

            if (output) {
                const selectedChoice = currentState.choices[index];
                if (
                    typeof selectedChoice.choice !== "string" &&
                    "type" in selectedChoice.choice
                ) {
                    selectedChoice.choice.output = output;
                }
            }

            if (variables) {
                for (const [key, value] of Object.entries(variables)) {
                    story.variablesState[key] = value;
                }
            }

            // Remove the hash from the URL
            history.replaceState(null, "", window.location.href.split("#")[0]);

            story.ChooseChoiceIndex(index);
            const newState = getStoryState({ story, currentState });
            if (newState) {
                const newGameState = [...(gameState || []), newState];
                set({
                    gameState: newGameState,
                    currentState: newState,
                    previousState: currentState,
                });
                return {
                    gameState: newGameState,
                    story,
                    error: get().error,
                };
            }
            return null;
        },
        back: () => {
            const { story, currentState, gameState } = get();
            const previousState = gameState[gameState.length - 2] ?? null;

            if (!story || !currentState || !previousState) {
                return;
            }

            story.state.LoadJson(
                typeof previousState.storyData === "string"
                    ? previousState.storyData
                    : JSON.stringify(previousState.storyData),
            );

            // Remove the hash from the URL
            history.replaceState(null, "", window.location.href.split("#")[0]);

            set({
                gameState: gameState.slice(0, -1),
                currentState: { ...previousState },
                previousState: { ...currentState },
            });
        },
    })),
);

const extractInput = (line: string) => {
    const input: Record<string, string> = {};
    const regex = /([\w-]+)="((?:[^"\\]|\\.)*)"/g;

    do {
        const match = regex.exec(line);
        if (match) {
            input[match[1]] = match[2];
        } else {
            break;
        }
        // biome-ignore lint/correctness/noConstantCondition: ...
    } while (true);

    return input;
};

const parseWidget = (
    line: string,
): string | Widget | Array<string | Widget> => {
    if (line.includes("!widget:")) {
        const type = /!widget:([\w-]+)/.exec(line)?.[1];
        if (!type) {
            return [line];
        }
        const input = extractInput(line);

        return {
            type,
            input,
        };
    }

    const widgets: Array<string | Widget> = [];
    const parts = line.split(/\[widget:/);

    for (const part of parts) {
        if (part.length === 0) {
            continue;
        }

        const match = /^([\w-]+)(.*?)\](.*?)\[\/widget:\1\](.*$)/g.exec(part);

        if (!match) {
            widgets.push(part);
            continue;
        }

        const type = match[1];
        const input = extractInput(match[2]);
        input.contents = match[3];
        widgets.push({
            type,
            input,
        } satisfies Widget);

        const rest = match[4];
        if (rest) {
            widgets.push(rest);
        }
    }

    if (widgets.length === 0) {
        return line;
    }

    return widgets;
};

const getStoryState = ({
    story,
    currentState,
}: {
    story: Story | null;
    currentState: GameState | null;
}): GameState | null => {
    if (!story || !story.canContinue) {
        return null;
    }

    const settings = getSettings();
    const lines: Array<string | Widget | Array<string | Widget>> = [];
    const tags: Record<string, string> = {};

    if (currentState && settings.stickyTags) {
        for (const tag of settings.stickyTags) {
            if (currentState.tags[tag]) {
                tags[tag] = currentState.tags[tag];
            }
        }
    }

    while (story.canContinue) {
        const textLine = story.Continue();
        if (textLine) {
            const trimmedTextLine = textLine.trim();
            if (trimmedTextLine) {
                const result = parseWidget(trimmedTextLine);
                lines.push(result);
            }
        }
        if (story.currentTags) {
            for (const tag of story.currentTags) {
                const [key, value] = tag.split(":").map((t) => t.trim());
                if (value === "None") {
                    delete tags[key];
                } else {
                    tags[key] = value;
                }
            }
        }
    }

    const choices = story.currentChoices.map((choice) => {
        const tags: Record<string, string> = {};
        if (choice.tags) {
            for (const tag of choice.tags) {
                const [key, value] = tag.split(":").map((t) => t.trim());
                if (value === "None") {
                    delete tags[key];
                } else {
                    tags[key] = value;
                }
            }
        }
        return {
            choice: parseWidget(choice.text),
            tags,
        };
    });

    const storyData = JSON.parse(story.state.toJson());

    return {
        id: crypto.randomUUID(),
        lines,
        tags,
        choices,
        storyData,
        widgets: {},
    } satisfies GameState;
};
