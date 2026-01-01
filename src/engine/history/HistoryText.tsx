import { ProcessedTextLine } from "../shared/process-text";
import type { GameState, Widget } from "../shared/types";
import { historyWidgets } from "../shared/widgets";

const Line = ({ text }: { text: string | Widget }) => {
    if (typeof text === "string") {
        return <ProcessedTextLine text={text} context="history" />;
    }
    const Widget = historyWidgets.get(text.type);
    if (Widget) {
        return <Widget input={text.input} />;
    }
    return null;
};

export default function HistoryText({
    currentState,
}: {
    currentState: GameState;
}) {
    return (
        <>
            {currentState.lines.map((line, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: ...
                <Line key={i} text={line} />
            ))}
        </>
    );
}
