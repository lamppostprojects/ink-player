import type { Story } from "inkjs";
import type React from "react";
import type { TransitionStatus } from "react-transition-state";

export type SavedGame = {
    id: string;
    title: string;
    steps: number;
    date: string;
    gameState: GameState[];
    storyData: string;
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
};

export type ScreenProps = {
    page: string;
    setPage: (page: string) => void;
    loading: boolean;
};

export type Screen = {
    id: string;
    title: string;
    component:
        | "History"
        | "Game"
        | string
        | ((props: ScreenProps) => React.ReactNode);
};

export type Settings = {
    enableDarkMode?: boolean | "toggle";
    defaultTheme?: string;
    loadStory: () => Promise<any>;
    defaultSaveName?: (currentState: GameState) => string;
    stickyTags?: string[];
    gameName: string;
    shortGameName?: string;
    favicon?: string;
    widgets?: Record<string, Record<string, any>>;
};

export type WidgetToastFn = (currentState: GameState) => {
    id: string;
    title: React.ReactNode;
    description: React.ReactNode;
}[];

export type WidgetChoiceProps = {
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

export type WidgetTextProps = {
    input: Record<string, string>;
    context: "game" | "history";
};

export type WidgetLogProps = {
    input: Record<string, string>;
    output?: Record<string, string>;
};

export type WidgetHeaderProps = {
    currentState: GameState;
    transitionStatus: TransitionStatus | undefined;
};

export type WidgetKnotProps = {
    currentState: GameState;
    transitionStatus: TransitionStatus | undefined;
};

export type WidgetKeyProps = {
    currentState: GameState;
};

export type WidgetProcessTextLineProps = {
    line: string;
    context: "game" | "history" | "choice" | "history-choice";
};

export type WidgetTextLineProps = {
    children: React.ReactNode;
    context: "game" | "history" | "choice" | "history-choice";
};

export type WidgetHandleStoryLoadProps = {
    story: Story;
};

export type WidgetRegistry = {
    type: string;
    log?: (props: WidgetLogProps) => string;
    toast?: WidgetToastFn;
    screen?: (props: ScreenProps) => React.ReactNode;
    footer?: () => React.ReactNode;
    text?: (props: WidgetTextProps) => React.ReactNode;
    choice?: (props: WidgetChoiceProps) => React.ReactNode;
    header?: (props: WidgetHeaderProps) => React.ReactNode;
    knot?: (props: WidgetKnotProps) => React.ReactNode;
    preload?: () => Promise<any>;
    key?: (props: WidgetKeyProps) => string | null;
    processTextLine?: (props: WidgetProcessTextLineProps) => string;
    textLine?: (props: WidgetTextLineProps) => React.ReactNode;
    handleStoryLoad?: (props: WidgetHandleStoryLoadProps) => void;
};
