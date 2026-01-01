import { processTextLineWidgets, textLineWidgets } from "./widgets";

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

export const ProcessedTextLine = ({
    text,
    context,
    tag: Tag = "p",
}: {
    text: string;
    context: "game" | "history" | "choice" | "history-choice";
    tag?: keyof React.JSX.IntrinsicElements;
}) => {
    const processedText = processText({ text, context });

    let contents = (
        // biome-ignore lint/security/noDangerouslySetInnerHtml: ...
        <Tag dangerouslySetInnerHTML={{ __html: processedText }} />
    );

    for (const TextLine of textLineWidgets.values()) {
        contents = <TextLine context={context}>{contents}</TextLine>;
    }

    return contents;
};
