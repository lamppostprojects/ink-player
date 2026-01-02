import SlashCircleIcon from "bootstrap-icons/icons/slash-circle.svg?react";
import Button from "react-bootstrap/Button";

import type { Widget } from "./types";
import {
    choiceWidgets,
    processTextLineWidgets,
    textLineWidgets,
    textWidgets,
} from "./widgets";

export const processText = ({
    text,
    context,
}: {
    text: string;
    context: "game" | "history" | "choice" | "history-choice";
}) => {
    let processedText = text;

    for (const processTextLine of processTextLineWidgets.values()) {
        processedText = processTextLine({
            line: processedText,
            context,
        });
    }

    return processedText;
};

const handleAutoFocus = (element: HTMLButtonElement | null) => {
    element?.focus({ preventScroll: true });
};

type ProcessedTextLineProps =
    | {
          context: "game" | "history";
          text: string | Widget;
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
          text: string | Widget;
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
    if (typeof text === "string") {
        const processedText = processText({ text, context });

        let contents = (
            // biome-ignore lint/security/noDangerouslySetInnerHtml: ...
            <Tag dangerouslySetInnerHTML={{ __html: processedText }} />
        );

        for (const TextLine of textLineWidgets.values()) {
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

    if (context === "game") {
        const Widget = textWidgets.get(text.type);
        if (Widget) {
            return <Widget context="game" input={text.input} />;
        }
    } else if (context === "choice") {
        const Widget = choiceWidgets.get(text.type);
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
        const Widget = choiceWidgets.get(text.type);
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
