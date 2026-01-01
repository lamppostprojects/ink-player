import SlashCircleIcon from "bootstrap-icons/icons/slash-circle.svg?react";
import { memo, useCallback, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Placeholder from "react-bootstrap/Placeholder";
import type { TransitionStatus } from "react-transition-state";

import { downloadHTMLLog } from "../history/download-log";
import { LoadModal } from "../saves/LoadModal";
import { useStoryStore } from "../shared/game-state";
import { ProcessedTextLine } from "../shared/process-text";
import { useSavedGamesStore } from "../shared/saved-games";
import type { GameState, Widget } from "../shared/types";
import { gameChoiceWidgets } from "../shared/widgets";

const handleAutoFocus = (element: HTMLButtonElement | null) => {
    element?.focus({ preventScroll: true });
};

const Choice = ({
    choice,
    onCompletion,
    autoFocus,
    disabled,
}: {
    choice: string | Widget;
    onCompletion: ({
        output,
        variables,
    }: {
        output?: Record<string, string>;
        variables?: Record<string, string>;
    }) => void;
    autoFocus: boolean;
    disabled: boolean;
}) => {
    const currentState = useStoryStore((state) => state.currentState);
    const story = useStoryStore((state) => state.story);

    if (!currentState || !story) {
        return null;
    }

    if (typeof choice === "string") {
        let contents = (
            <ProcessedTextLine text={choice} context="choice" tag="span" />
        );

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

    const Widget = gameChoiceWidgets.get(choice.type);
    if (Widget) {
        return (
            <Widget
                input={choice.input}
                onCompletion={onCompletion}
                autoFocus={autoFocus}
                disabled={disabled}
            />
        );
    }

    return null;
};

function GameChoices({
    disabled,
    currentState,
    transitionStatus,
    isMounted,
}: {
    disabled: boolean;
    currentState: GameState | null;
    transitionStatus: TransitionStatus | undefined;
    isMounted: boolean;
}) {
    const gameState = useStoryStore((state) => state.gameState);
    const selectChoice = useStoryStore((state) => state.selectChoice);
    const deleteSavedGame = useSavedGamesStore(
        (state) => state.deleteSavedGame,
    );
    const addSavedGame = useSavedGamesStore((state) => state.addSavedGame);
    const localSaveOnly = useSavedGamesStore(
        (state) => !state.canSaveInLocalStorage(),
    );
    const startNewGame = useStoryStore((state) => state.startNewGame);
    const [showLoadModal, setShowLoadModal] = useState(false);
    const error = useStoryStore((state) => state.error);

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

                if (results && !localSaveOnly) {
                    const { gameState, story, error } = results;

                    if (error) {
                        return;
                    }

                    deleteSavedGame("autosave");
                    addSavedGame({
                        id: "autosave",
                        title: "Autosave",
                        steps: Math.max(gameState.length - 1, 1),
                        date: new Date().toLocaleString(),
                        gameState,
                        storyData: story.state.toJson(),
                    });
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

    if (!isMounted || !transitionStatus) {
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
        <Choice
            key={`choice-${currentState.id}-${index}`}
            autoFocus={index === 0}
            choice={choice.choice}
            onCompletion={onCompletion(index)}
            disabled={"disabled" in choice.tags}
        />
    ));

    return (
        <div
            className={`d-grid gap-3 choices-container transitioned ${transitionStatus}`}
        >
            {choices}
        </div>
    );
}

export default memo(GameChoices);
