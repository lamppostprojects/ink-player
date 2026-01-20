import SlashCircleIcon from "bootstrap-icons/icons/slash-circle.svg?react";
import Button from "react-bootstrap/Button";

import { getPluginsByType } from "./plugins";
import type { Widget } from "./types";

const getProcessedTextArray = ({
    text,
    context,
}: {
    text: Array<string | Widget>;
    context: "game" | "history" | "choice" | "history-choice" | "screen";
}) => {
    return text
        .map((line) => {
            if (typeof line !== "string") {
                const Widget = getPluginsByType("text").get(line.type);

                if (!Widget) {
                    return null;
                }

                return (
                    <Widget
                        context={
                            context === "screen"
                                ? "screen"
                                : context === "game" || context === "choice"
                                  ? "game"
                                  : "history"
                        }
                        input={line.input}
                    />
                );
            }

            if (context === "screen") {
                return null;
            }

            let processedText = line;

            for (const processTextLine of getPluginsByType(
                "processTextLine",
            ).values()) {
                processedText = processTextLine({
                    line: processedText,
                    context,
                });
            }

            // biome-ignore lint/security/noDangerouslySetInnerHtml: ...
            return <span dangerouslySetInnerHTML={{ __html: processedText }} />;
        })
        .filter(Boolean);
};

const handleAutoFocus = (element: HTMLButtonElement | null) => {
    element?.focus({ preventScroll: true });
};

type ProcessedTextLineProps =
    | {
          context: "game" | "history" | "screen";
          text: string | Widget | Array<string | Widget>;
          tag?: keyof React.JSX.IntrinsicElements;
          onCompletion?: ({
              output,
              variables,
          }: {
              output?: Record<string, string>;
              variables?: Record<string, string>;
          }) => void;
          autoFocus?: boolean;
          disabled?: boolean;
      }
    | {
          context: "choice" | "history-choice";
          text: string | Widget | Array<string | Widget>;
          tag?: keyof React.JSX.IntrinsicElements;
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

export const ProcessedTextLine = ({
    text,
    context,
    onCompletion,
    autoFocus,
    disabled,
    tag: Tag = "p",
}: ProcessedTextLineProps) => {
    if (typeof text === "string" || Array.isArray(text)) {
        const processedText = getProcessedTextArray({
            text: Array.isArray(text) ? text : [text],
            context,
        });

        if (processedText.length === 0) {
            return null;
        }

        let contents = <Tag>{processedText}</Tag>;

        for (const TextLine of getPluginsByType("textLine").values()) {
            contents = <TextLine context={context}>{contents}</TextLine>;
        }

        if (context === "choice") {
            if (disabled) {
                contents = (
                    <span>
                        <SlashCircleIcon className="bi" /> {contents}
                    </span>
                );
            }
            return (
                <Button
                    ref={autoFocus ? handleAutoFocus : undefined}
                    variant="light"
                    className="text-start"
                    onClick={() => onCompletion({})}
                    disabled={disabled}
                >
                    {contents}
                </Button>
            );
        }

        return contents;
    }

    if (context === "game" || context === "screen") {
        const Widget = getPluginsByType("text").get(text.type);
        if (Widget) {
            return <Widget context={context} input={text.input} />;
        }
    } else if (context === "choice") {
        const Widget = getPluginsByType("choice").get(text.type);
        if (Widget) {
            return (
                <Widget
                    context="game"
                    input={text.input}
                    onCompletion={onCompletion}
                    autoFocus={autoFocus}
                    disabled={disabled}
                />
            );
        }
    } else if (context === "history-choice") {
        const Widget = getPluginsByType("choice").get(text.type);
        if (Widget) {
            return (
                <Widget
                    context="history"
                    input={text.input}
                    onCompletion={onCompletion}
                    autoFocus={autoFocus}
                    disabled={disabled}
                />
            );
        }
    }

    return null;
};
