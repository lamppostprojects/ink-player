import { ProcessedTextLine } from "../shared/process-text";
import type { GameState } from "../shared/types";
import { historyWidgets } from "../shared/widgets";

export default function HistoryChoices({
    currentState,
}: {
    currentState: GameState;
}) {
    if (currentState.selectedChoice == null) {
        return null;
    }

    const { choice } = currentState.choices[currentState.selectedChoice];

    if (typeof choice === "string") {
        return (
            <p>
                <strong>
                    &raquo;{" "}
                    <ProcessedTextLine
                        text={choice}
                        context="history-choice"
                        tag="span"
                    />
                </strong>
            </p>
        );
    }

    const Widget = historyWidgets.get(choice.type);
    if (Widget) {
        return <Widget input={choice.input} output={choice.output} />;
    }
    return null;
}
