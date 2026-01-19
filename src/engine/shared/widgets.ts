import { getSettings } from "./settings";
import type {
    ScreenProps,
    WidgetChoiceProps,
    WidgetHandleStoryLoadProps,
    WidgetHeaderProps,
    WidgetKeyProps,
    WidgetKnotProps,
    WidgetLogProps,
    WidgetProcessTextLineProps,
    WidgetRegistry,
    WidgetTextLineProps,
    WidgetTextProps,
    WidgetToastFn,
} from "./types";

export const logWidgets = new Map<string, (props: WidgetLogProps) => string>();
export const toastWidgets = new Map<string, WidgetToastFn>();
export const screenWidgets = new Map<
    string,
    (props: ScreenProps) => React.ReactNode
>();
export const footerWidgets = new Map<
    string,
    (props: WidgetKnotProps) => React.ReactNode
>();
export const textWidgets = new Map<
    string,
    (props: WidgetTextProps) => React.ReactNode
>();
export const choiceWidgets = new Map<
    string,
    (props: WidgetChoiceProps) => React.ReactNode
>();
export const headerWidgets = new Map<
    string,
    (props: WidgetHeaderProps) => React.ReactNode
>();
export const knotWidgets = new Map<
    string,
    (props: WidgetKnotProps) => React.ReactNode
>();
export const preloadWidgets = new Map<string, () => Promise<any>>();
export const keyWidgets = new Map<
    string,
    (props: WidgetKeyProps) => string | null
>();
export const processTextLineWidgets = new Map<
    string,
    (props: WidgetProcessTextLineProps) => string
>();
export const textLineWidgets = new Map<
    string,
    (props: WidgetTextLineProps) => React.ReactNode
>();
export const handleStoryLoadWidgets = new Map<
    string,
    (props: WidgetHandleStoryLoadProps) => void
>();
export const navWidgets = new Map<
    string,
    (props: ScreenProps) => React.ReactNode
>();

export const registerWidget = (widget: WidgetRegistry | null) => {
    if (!widget) {
        return;
    }
    if (widget.log) {
        logWidgets.set(widget.type, widget.log);
    }
    if (widget.toast) {
        toastWidgets.set(widget.type, widget.toast);
    }
    if (widget.screen) {
        screenWidgets.set(widget.type, widget.screen);
    }
    if (widget.footer) {
        footerWidgets.set(widget.type, widget.footer);
    }
    if (widget.text) {
        textWidgets.set(widget.type, widget.text);
    }
    if (widget.choice) {
        choiceWidgets.set(widget.type, widget.choice);
    }
    if (widget.header) {
        headerWidgets.set(widget.type, widget.header);
    }
    if (widget.knot) {
        knotWidgets.set(widget.type, widget.knot);
    }
    if (widget.nav) {
        navWidgets.set(widget.type, widget.nav);
    }
    if (widget.preload) {
        preloadWidgets.set(widget.type, widget.preload);
    }
    if (widget.key) {
        keyWidgets.set(widget.type, widget.key);
    }
    if (widget.processTextLine) {
        processTextLineWidgets.set(widget.type, widget.processTextLine);
    }
    if (widget.textLine) {
        textLineWidgets.set(widget.type, widget.textLine);
    }
    if (widget.handleStoryLoad) {
        handleStoryLoadWidgets.set(widget.type, widget.handleStoryLoad);
    }
};

export const getWidgetSettings = (widget: string) => {
    return getSettings().widgets?.[widget] as Record<string, any> | undefined;
};
