import { ProcessedTextLine } from "../shared/process-text";
import type { GameState } from "../shared/types";

export default function HistoryChoices({
    currentState,
}: {
    currentState: GameState;
}) {
    if (currentState.selectedChoice == null) {
        return null;
    }

    const { choice } = currentState.choices[currentState.selectedChoice];

    if (typeof choice === "string" || Array.isArray(choice)) {
        return (
            <p>
                <strong>
                    &raquo;{" "}
                    <ProcessedTextLine
                        text={choice}
                        context="history-choice"
                        tag="span"
                        onCompletion={() => {}}
                        autoFocus={false}
                        disabled={false}
                    />
                </strong>
            </p>
        );
    }

    return null;
}
