import type { Story } from "inkjs";
import type React from "preact/compat";
import type { TransitionStatus } from "react-transition-state";

import type { createPlugin } from "./plugins";

export type SavedGame = {
    id: string;
    title: string;
    steps: number;
    date: string;
    gameState: GameState[];
};

export type Widget = {
    type: string;
    input: Record<string, string>;
    output?: Record<string, string>;
};

export type GameState = {
    id: string;
    lines: Array<string | Widget | Array<string | Widget>>;
    tags: Record<string, string>;
    choices: Array<{
        choice: string | Widget | Array<string | Widget>;
        tags: Record<string, string>;
    }>;
    selectedChoice?: number;
    widgets: Record<string, any>;
    storyData?: string;
};

export type PageProps = {
    page: string;
    setPage: (page: string) => void;
    loading: boolean;
};

export type Page = {
    id: string;
    title: string;
    component:
        | "game"
        | string
        | ((props: PageProps) => React.ReactNode);
};

type SharedSettings = {
    enableKeyboardInput?: boolean;
    enableGameScreen?: boolean;
    defaultTheme?: string;
    loadStory: () => Promise<any>;
    defaultSaveName?: (currentState: GameState) => string;
    stickyTags?: string[];
    gameName: string;
    shortGameName?: string;
    favicon?: string;
    widgets?: Record<string, Record<string, any>>;
    pages: Page[];
};

export type IncomingSettings = SharedSettings & {
    plugins?: Array<
        ReturnType<ReturnType<typeof createPlugin>> | null | undefined
    >;
};

export type Settings = SharedSettings & {
    plugins: Array<PluginRegistry>;
};

type PluginToastFn = (currentState: GameState) => {
    id: string;
    title: React.ReactNode;
    description: React.ReactNode;
}[];

type PluginChoiceProps = {
    context: "game" | "history";
    input: Record<string, string>;
    output?: Record<string, string>;
    onCompletion: ({
        output,
        variables,
    }: {
        output?: Record<string, string>;
        variables?: Record<string, string>;
    }) => void;
    autoFocus: boolean;
    disabled: boolean;
};

type PluginTextProps = {
    input: Record<string, string>;
    context: "game" | "history" | "screen";
};

type PluginLogProps =
    | { currentState: GameState; location: "header" | "footer" }
    | {
          input: Record<string, string>;
          output?: Record<string, string>;
      };

type PluginHeaderProps = {
    context: "game" | "history" | "screen";
    currentState: GameState;
    transitionStatus: TransitionStatus | undefined;
};

type PluginKnotProps = {
    context: "game" | "history" | "screen";
    currentState: GameState;
    transitionStatus: TransitionStatus | undefined;
};

type PluginKeyProps = {
    currentState: GameState;
};

type PluginProcessTextLineProps = {
    line: string;
    context: "game" | "history" | "choice" | "history-choice" | "screen";
};

type PluginTextLineProps = {
    children: React.ReactNode;
    context: "game" | "history" | "choice" | "history-choice" | "screen";
};

type PluginHandleStoryLoadProps = {
    story: Story;
};

export type PluginRegistry = {
    type: string;
    log?: (props: PluginLogProps) => string;
    toast?: PluginToastFn;
    page?: (props: PageProps) => React.ReactNode;
    footer?: (props: PluginKnotProps) => React.ReactNode;
    text?: (props: PluginTextProps) => React.ReactNode;
    choice?: (props: PluginChoiceProps) => React.ReactNode;
    header?: (props: PluginHeaderProps) => React.ReactNode;
    knot?: (props: PluginKnotProps) => React.ReactNode;
    nav?: (props: PageProps) => React.ReactNode;
    preload?: () => Promise<any>;
    key?: (props: PluginKeyProps) => string | null;
    processTextLine?: (props: PluginProcessTextLineProps) => string;
    textLine?: (props: PluginTextLineProps) => React.ReactNode;
    handleStoryLoad?: (props: PluginHandleStoryLoadProps) => void;
};
