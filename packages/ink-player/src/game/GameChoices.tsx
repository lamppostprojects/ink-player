import { memo } from "preact/compat";
import { useCallback, useEffect, useState } from "preact/hooks";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Placeholder from "react-bootstrap/Placeholder";
import type { TransitionStatus } from "react-transition-state";

import { downloadHTMLLog } from "./download-log";
import { LoadModal } from "../saves/LoadModal";
import { getUseStoryStore } from "../shared/game-state";
import { ProcessedTextLine } from "../shared/process-text";
import { getUseSavedGamesStore } from "../shared/saved-games";
import { getSettings } from "../shared/settings";
import type { GameState } from "../shared/types";

function GameChoices({
    disabled,
    currentState,
    transitionStatus,
    isMounted,
    context,
}: {
    disabled: boolean;
    currentState: GameState | null;
    transitionStatus: TransitionStatus | undefined;
    isMounted: boolean;
    context: "game" | "screen";
}) {
    const useStoryStore = getUseStoryStore();
    const gameState = useStoryStore((state) => state.gameState);
    const selectChoice = useStoryStore((state) => state.selectChoice);
    const startNewGame = useStoryStore((state) => state.startNewGame);
    const getSaveState = useStoryStore((state) => state.getSaveState);
    const useSavedGamesStore = getUseSavedGamesStore();
    const autosave = useSavedGamesStore((state) => state.autosave);
    const [showLoadModal, setShowLoadModal] = useState(false);
    const error = useStoryStore((state) => state.error);
    const settings = getSettings();

    const onCompletion = useCallback(
        (index: number) => {
            return ({
                output,
                variables,
            }: {
                output?: Record<string, string>;
                variables?: Record<string, string>;
            }) => {
                if (disabled) {
                    return;
                }

                const results = selectChoice({ index, output, variables });

                if (results) {
                    const { error } = results;

                    if (error) {
                        return;
                    }

                    autosave(getSaveState);
                }

                window.scrollTo({ top: 0, behavior: "smooth" });
            };
        },
        [selectChoice],
    );

    const handleLoadSavedGame = useCallback(() => {
        setShowLoadModal(true);
    }, [setShowLoadModal]);

    const handleLoadModalClose = useCallback(() => {
        setShowLoadModal(false);
    }, [setShowLoadModal]);

    const handleDownloadHTMLLog = useCallback(() => {
        downloadHTMLLog(gameState);
    }, [gameState]);

    const handleKeyPress = useCallback(
        (event: KeyboardEvent) => {
            if (
                !settings.enableKeyboardInput ||
                event.currentTarget instanceof HTMLInputElement
            ) {
                return;
            }

            // If the user presses a number key, select the choice at that index
            if (
                context === "game" &&
                currentState &&
                event.key >= "0" &&
                event.key <= "9"
            ) {
                event.preventDefault();
                event.stopPropagation();
                const index = parseFloat(event.key) - 1;
                if (index >= 0 && index < currentState.choices.length) {
                    onCompletion(index)({});
                }
            }
        },
        [currentState, onCompletion, context],
    );

    useEffect(() => {
        document.addEventListener("keyup", handleKeyPress);
        return () => document.removeEventListener("keyup", handleKeyPress);
    }, [handleKeyPress]);

    if (!isMounted || !transitionStatus || context === "screen") {
        return null;
    }

    if (!currentState) {
        return (
            <>
                <p>
                    <Placeholder.Button
                        xs={5}
                        variant="light"
                        className="placeholder-wave"
                    />
                </p>
                <p>
                    <Placeholder.Button
                        xs={7}
                        variant="light"
                        className="placeholder-wave"
                    />
                </p>
                <p>
                    <Placeholder.Button
                        xs={6}
                        variant="light"
                        className="placeholder-wave"
                    />
                </p>
                <p>
                    <Placeholder.Button
                        xs={3}
                        variant="light"
                        className="placeholder-wave"
                    />
                </p>
            </>
        );
    }

    // If there are no choices then we're at the end of the story
    if (error || currentState.choices.length === 0) {
        const errorMessage = error ? (
            <Alert variant="danger">
                There was an error loading the game. Please download your HTML
                game log and share it with the developer.
            </Alert>
        ) : null;

        return (
            <>
                {errorMessage}
                <hr />
                <div className="text-center">
                    <Button
                        variant="primary"
                        className="m-3"
                        onClick={handleDownloadHTMLLog}
                    >
                        Download HTML Log
                    </Button>
                    {!error && (
                        <Button
                            variant="primary"
                            className="m-3"
                            onClick={startNewGame}
                        >
                            Restart
                        </Button>
                    )}
                    <Button
                        variant="primary"
                        className="m-3"
                        onClick={handleLoadSavedGame}
                    >
                        Load Game
                    </Button>
                    <LoadModal
                        show={showLoadModal}
                        handleClose={handleLoadModalClose}
                    />
                </div>
            </>
        );
    }

    const choices = currentState.choices.map((choice, index) => (
        <li key={`choice-${currentState.id}-${index}`}>
            <ProcessedTextLine
                text={choice.choice}
                context="choice"
                tag="span"
                autoFocus={index === 0}
                onCompletion={onCompletion(index)}
                disabled={"disabled" in choice.tags}
            />
        </li>
    ));

    return (
        <ol
            className={`d-grid gap-3 choices-container transitioned ${transitionStatus} ${settings.enableKeyboardInput ? "keyboard-input" : ""} ${currentState.choices.length > 1 ? "has-multiple-choices" : ""}`}
        >
            {choices}
        </ol>
    );
}

export default memo(GameChoices);
