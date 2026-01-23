import { ProcessedTextLine } from "../../shared/process-text";
import type { GameState } from "../../shared/types";

export default function HistoryText({
    currentState,
}: {
    currentState: GameState;
}) {
    return (
        <>
            {currentState.lines.map((line, index) => (
                <ProcessedTextLine
                    key={`line-${currentState.id}-${index}`}
                    text={line}
                    context="history"
                />
            ))}
        </>
    );
}
