import { memo } from "react";
import Placeholder from "react-bootstrap/Placeholder";
import type { TransitionStatus } from "react-transition-state";

import { ProcessedTextLine } from "../shared/process-text";
import type { GameState } from "../shared/types";

function GameText({
    currentState,
    transitionStatus,
    isMounted,
}: {
    currentState: GameState | null;
    transitionStatus: TransitionStatus | undefined;
    isMounted: boolean;
}) {
    if (!isMounted || !transitionStatus) {
        return null;
    }

    if (!currentState) {
        return (
            <div style={{ marginBottom: "1rem" }}>
                <Placeholder xs={12} className="placeholder-wave" />
                <Placeholder xs={12} className="placeholder-wave" />
                <Placeholder xs={5} className="placeholder-wave" />
                <Placeholder xs={12} className="placeholder-wave" />
                <Placeholder xs={12} className="placeholder-wave" />
                <Placeholder xs={12} className="placeholder-wave" />
                <Placeholder xs={7} className="placeholder-wave" />
            </div>
        );
    }

    const text = currentState.lines.map((line, index) => (
        <ProcessedTextLine
            key={`line-${currentState.id}-${index}`}
            text={line}
            context="game"
        />
    ));

    return (
        <div className={`text-container transitioned ${transitionStatus}`}>
            {text}
        </div>
    );
}

export default memo(GameText);
