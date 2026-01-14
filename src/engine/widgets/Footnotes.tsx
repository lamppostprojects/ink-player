import { ProcessedTextLine } from "../shared/process-text";
import type {
    GameState,
    Widget,
    WidgetKnotProps,
    WidgetRegistry,
    WidgetTextProps,
} from "../shared/types";

const collectWidgets = ({
    gameState,
    type,
}: {
    gameState: GameState | null;
    type: string;
}) => {
    const widgets: Array<Widget> = [];

    if (!gameState) {
        return widgets;
    }

    for (const line of gameState.lines) {
        if (typeof line === "string") {
            continue;
        }

        if (!Array.isArray(line)) {
            if (line.type === type) {
                widgets.push(line);
            }
            continue;
        }

        for (const part of line) {
            if (typeof part === "string") {
                continue;
            }

            if (part.type === type) {
                widgets.push(part);
            }
        }
    }

    for (const { choice } of gameState.choices) {
        if (typeof choice === "string") {
            continue;
        }

        if (!Array.isArray(choice)) {
            if (choice.type === type) {
                widgets.push(choice);
            }
            continue;
        }

        for (const part of choice) {
            if (typeof part === "string") {
                continue;
            }

            if (part.type === type) {
                widgets.push(part);
            }
        }
    }

    return widgets;
};

const FootnoteReference = ({ input, context }: WidgetTextProps) => {
    if (context === "history") {
        return null;
    }

    if (input.link !== "true") {
        return null;
    }

    const id = input.id ?? "unknown";

    return (
        <a href={`#note-${id}`} id={`ref-${id}`} className="footnote">
            {id}
        </a>
    );
};

const FootnoteFooter = ({
    context,
    transitionStatus,
    currentState,
}: WidgetKnotProps) => {
    const footnotes = collectWidgets({
        gameState: currentState,
        type: "footnote",
    });

    if (
        footnotes.length === 0 ||
        context === "history" ||
        context === "screen"
    ) {
        return null;
    }

    return (
        <div className={`mt-3 transitioned ${transitionStatus || ""}`}>
            <p>
                <strong>Footnotes</strong>
            </p>

            <ol className="small">
                {footnotes.map((widget) => {
                    const id = widget.input.id ?? "unknown";
                    return (
                        <li id={`note-${id}`} className="footnote-entry">
                            {widget.input.link === "true" ? (
                                <>
                                    <a href={`#ref-${id}`}>^</a>{" "}
                                </>
                            ) : null}
                            <ProcessedTextLine
                                text={widget.input.contents}
                                context="game"
                                tag="span"
                            />
                        </li>
                    );
                })}
            </ol>
        </div>
    );
};

export const footnoteWidget = {
    type: "footnote",
    text: FootnoteReference,
    footer: FootnoteFooter,
    key: ({ currentState }) => currentState.id,
} satisfies WidgetRegistry;
