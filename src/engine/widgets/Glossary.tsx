import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "preact/hooks";
import Overlay, { type OverlayInjectedProps } from "react-bootstrap/Overlay";
import Popover from "react-bootstrap/Popover";

import { useStoryStore } from "../shared/game-state";
import type {
    WidgetHandleStoryLoadProps,
    WidgetProcessTextLineProps,
    WidgetRegistry,
    WidgetTextLineProps,
} from "../shared/types";

const glossary = new Map<string, string | null>();
let glossaryRegex: RegExp | null = null;

const handleStoryLoad = ({ story }: WidgetHandleStoryLoadProps) => {
    const namedOnlyContent = story.mainContentContainer.namedOnlyContent;

    for (const name of namedOnlyContent?.keys() ?? []) {
        if (name.startsWith("glossary_")) {
            glossary.set(name.slice(9), null);
        }
    }

    if (glossary.size > 0) {
        glossaryRegex = new RegExp(
            `\\b(${Array.from(glossary.keys())
                .map((key) => key.replace(/_/g, "."))
                .join("|")})(?=\\b|[^\\w])`,
            "gi",
        );
    }
};

const processTextLine = ({ line, context }: WidgetProcessTextLineProps) => {
    if (!glossaryRegex) {
        return line;
    }

    return line.replace(glossaryRegex, (match) => {
        const glossaryKey = match.toLowerCase().replace(/[ -]/g, "_");
        if (!glossary.has(glossaryKey)) {
            return match;
        }
        const isProperNoun = match.charAt(0).toUpperCase() === match.charAt(0);
        const className = `glossary${isProperNoun ? " proper-noun" : ""}`;
        const tagName = context === "choice" ? "i" : "a";
        if (tagName === "a") {
            return `<a href="#glossary-${match.toLowerCase()}" data-glossary-key="${glossaryKey}" class="${className}">${match}</a>`;
        }
        return `<i data-glossary-key="${glossaryKey}" class="${className}">${match}</i>`;
    });
};

const TextLine = ({ children, context }: WidgetTextLineProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [currentElement, setCurrentElement] =
        useState<HTMLAnchorElement | null>(null);
    const [anchors, setAnchors] = useState<HTMLAnchorElement[]>([]);

    const handleActivation = useCallback(
        (event: React.MouseEvent<HTMLElement>) => {
            if (currentElement) {
                return;
            }
            const current = event.target as HTMLAnchorElement;
            if (!(current instanceof HTMLAnchorElement)) {
                return;
            }
            if (!current.classList.contains("glossary")) {
                return;
            }
            event.preventDefault();
            setCurrentElement(current);
            const handleClose = (e: MouseEvent | FocusEvent) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentElement(null);
                cleanup();
            };
            const cleanup = () => {
                current.removeEventListener("mouseleave", handleClose);
                current.removeEventListener("click", handleClose);
                current.removeEventListener("blur", handleClose);
            };
            current.addEventListener("mouseleave", handleClose);
            current.addEventListener("click", handleClose);
            current.addEventListener("blur", handleClose);
            return cleanup;
        },
        [setCurrentElement, currentElement],
    );

    useEffect(() => {
        const anchors = ref.current?.querySelectorAll("a.glossary");
        if (anchors) {
            setAnchors(Array.from(anchors) as HTMLAnchorElement[]);
        }
    }, [ref]);

    const story = useStoryStore((state) => state.story);

    const renderPopover = useCallback(
        (props: OverlayInjectedProps, anchor: HTMLAnchorElement) => {
            const id = new URL(anchor.href).hash.slice(1);

            const lines = useMemo(() => {
                const key = anchor.getAttribute("data-glossary-key");

                if (!key) {
                    return [];
                }

                let definition = glossary.get(key);
                if (!definition) {
                    definition = story?.EvaluateFunction(
                        `glossary_${key}`,
                        [],
                        true,
                    )?.output;
                }
                if (!definition) {
                    return [];
                }
                return definition.trim().split("\n");
            }, [anchor]);

            return (
                <Popover {...props} id={id} className="glossary-popover">
                    <Popover.Body>
                        {lines.map((line) => (
                            <div
                                // biome-ignore lint/security/noDangerouslySetInnerHtml: We want to render the HTML
                                dangerouslySetInnerHTML={{
                                    __html: line,
                                }}
                            />
                        ))}
                    </Popover.Body>
                </Popover>
            );
        },
        [story],
    );

    if (glossary.size === 0) {
        return children;
    }

    const Element = context === "history-choice" ? "span" : "div";

    return (
        <Element
            ref={ref}
            onClick={handleActivation}
            onMouseEnterCapture={handleActivation}
        >
            {children}
            {anchors.map(
                (anchor) =>
                    anchor === currentElement && (
                        <Overlay
                            target={anchor}
                            placement="bottom"
                            flip={true}
                            show={true}
                        >
                            {(props) => renderPopover(props, anchor)}
                        </Overlay>
                    ),
            )}
        </Element>
    );
};

export const glossaryWidget = {
    type: "glossary",
    processTextLine,
    textLine: TextLine,
    handleStoryLoad,
} satisfies WidgetRegistry;
