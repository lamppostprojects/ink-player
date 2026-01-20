import {
    createPlugin,
    type GameState,
    ProcessedTextLine,
    type Widget,
} from "@lamppost/ink-player";
import { Accordion } from "react-bootstrap";
import { create } from "zustand";
import { persist } from "zustand/middleware";

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

// biome-ignore lint/complexity/noBannedTypes: empty object is ok
type FootnotesSettings = {};

export default createPlugin<FootnotesSettings>(({ gameSettings }) => {
    const useFootnotesStore = create<{
        open: boolean;
        setOpen: (open: boolean) => void;
    }>()(
        persist(
            (set) => ({
                open: true,
                setOpen: (open: boolean) => set({ open }),
            }),
            {
                name: `${gameSettings.gameName}-footnotes`,
            },
        ),
    );

    return {
        type: "footnote",
        text({ input, context }) {
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
        },
        footer({ context, transitionStatus, currentState }) {
            const open = useFootnotesStore((state) => state.open);
            const setOpen = useFootnotesStore((state) => state.setOpen);

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
                <Accordion
                    className={`footnotes transitioned ${transitionStatus || ""}`}
                    activeKey={open ? "0" : undefined}
                    onSelect={(eventKey) => setOpen(eventKey === "0")}
                >
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Footnotes</Accordion.Header>
                        <Accordion.Body>
                            <ol className="small">
                                {footnotes.map((widget) => {
                                    const id = widget.input.id ?? "unknown";
                                    return (
                                        <li
                                            id={`note-${id}`}
                                            className="footnote-entry"
                                        >
                                            {widget.input.link === "true" ? (
                                                <>
                                                    <a href={`#ref-${id}`}>
                                                        ^
                                                    </a>{" "}
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
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            );
        },
        key: ({ currentState }) => currentState.id,
    };
});
