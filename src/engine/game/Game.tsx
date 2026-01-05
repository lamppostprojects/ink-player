import Card from "react-bootstrap/Card";
import { useTransitionMap } from "react-transition-state";

import { useStoryStore } from "../shared/game-state";
import {
    footerWidgets,
    headerWidgets as headerWidgetsMap,
    keyWidgets,
    knotWidgets as knotWidgetsMap,
} from "../shared/widgets";
import GameChoices from "./GameChoices";
import GameText from "./GameText";

export function Game() {
    const gameId = useStoryStore((state) => state.id);
    const currentState = useStoryStore((state) => state.currentState);
    let previousState = useStoryStore((state) => state.previousState);
    const { toggle, setItem, stateMap, deleteItem } = useTransitionMap<string>({
        unmountOnExit: true,
        timeout: 300,
        preEnter: true,
        preExit: true,
    });

    const previousStateId = previousState?.id
        ? `${gameId}-${previousState?.id}`
        : undefined;
    const currentStateId = currentState?.id
        ? `${gameId}-${currentState?.id}`
        : undefined;
    const previousTransitionState = previousStateId
        ? stateMap.get(previousStateId)
        : undefined;
    const currentTransitionState = currentStateId
        ? stateMap.get(currentStateId)
        : undefined;

    if (
        (previousTransitionState?.status === "unmounted" ||
            previousTransitionState?.status === "exited") &&
        previousStateId
    ) {
        deleteItem(previousStateId);
        useStoryStore.setState({ previousState: null });
        return;
    }

    if (previousTransitionState?.status === "exited") {
        previousState = null;
    }

    if (
        previousStateId &&
        !stateMap.has(previousStateId) &&
        previousTransitionState?.status !== "exited" &&
        previousTransitionState?.status !== "unmounted"
    ) {
        setItem(previousStateId);
    }

    if (currentStateId && !stateMap.has(currentStateId)) {
        if (previousStateId && previousTransitionState?.status !== "exited") {
            toggle(previousStateId, false);
        }
        if (!previousTransitionState?.isMounted) {
            setItem(currentStateId, {
                initialEntered: previousState === null,
            });
            toggle(currentStateId, true);
        }
    }

    const headerWidgets = [];
    const knotWidgets = [];
    const footerWidgetsShown = [];

    if (currentState) {
        for (const [type, Widget] of Array.from(headerWidgetsMap.entries())) {
            const getKey = keyWidgets.get(type);
            const prevKey = previousState
                ? getKey?.({ currentState: previousState })
                : null;
            const currKey = getKey?.({ currentState });

            if (currentTransitionState?.isMounted) {
                headerWidgets.push(
                    <Widget
                        key={currKey}
                        context="game"
                        currentState={currentState}
                        transitionStatus={
                            prevKey !== currKey
                                ? currentTransitionState?.status
                                : undefined
                        }
                    />,
                );
            }

            if (previousState && previousTransitionState?.isMounted) {
                headerWidgets.push(
                    <Widget
                        key={prevKey}
                        context="game"
                        currentState={previousState}
                        transitionStatus={
                            prevKey !== currKey
                                ? previousTransitionState?.status
                                : undefined
                        }
                    />,
                );
            }
        }

        for (const [type, Widget] of Array.from(knotWidgetsMap.entries())) {
            const getKey = keyWidgets.get(type);
            const prevKey = previousState
                ? getKey?.({ currentState: previousState })
                : null;
            const currKey = getKey?.({ currentState });

            if (currentTransitionState?.isMounted) {
                knotWidgets.push(
                    <Widget
                        key={currKey}
                        context="game"
                        currentState={currentState}
                        transitionStatus={
                            prevKey !== currKey
                                ? currentTransitionState?.status
                                : undefined
                        }
                    />,
                );
            }

            if (previousState && previousTransitionState?.isMounted) {
                knotWidgets.push(
                    <Widget
                        key={prevKey}
                        context="game"
                        currentState={previousState}
                        transitionStatus={
                            prevKey !== currKey
                                ? previousTransitionState?.status
                                : undefined
                        }
                    />,
                );
            }
        }

        for (const [type, Widget] of Array.from(footerWidgets.entries())) {
            const getKey = keyWidgets.get(type);
            const prevKey = previousState
                ? getKey?.({ currentState: previousState })
                : null;
            const currKey = getKey?.({ currentState });

            if (currentTransitionState?.isMounted) {
                footerWidgetsShown.push(
                    <Widget
                        key={currKey}
                        context="game"
                        currentState={currentState}
                        transitionStatus={
                            prevKey !== currKey
                                ? currentTransitionState?.status
                                : undefined
                        }
                    />,
                );
            }

            if (previousState && previousTransitionState?.isMounted) {
                footerWidgetsShown.push(
                    <Widget
                        key={prevKey}
                        context="game"
                        currentState={previousState}
                        transitionStatus={
                            prevKey !== currKey
                                ? previousTransitionState?.status
                                : undefined
                        }
                    />,
                );
            }
        }
    }

    return (
        <div className="game-container">
            <Card>
                {headerWidgets.length > 0 && (
                    <div className="header-widgets position-relative">
                        {headerWidgets}
                    </div>
                )}
                <Card.Body>
                    <div className="clearfix">
                        {knotWidgets}
                        {previousState && (
                            <GameText
                                key={previousStateId}
                                currentState={previousState}
                                transitionStatus={
                                    previousTransitionState?.status
                                }
                                isMounted={!!previousTransitionState?.isMounted}
                            />
                        )}
                        <GameText
                            key={currentStateId}
                            currentState={currentState}
                            transitionStatus={currentTransitionState?.status}
                            isMounted={!!currentTransitionState?.isMounted}
                        />
                    </div>
                    {previousState && (
                        <GameChoices
                            key={previousStateId}
                            currentState={previousState}
                            disabled={
                                previousTransitionState?.status === "exiting"
                            }
                            transitionStatus={previousTransitionState?.status}
                            isMounted={!!previousTransitionState?.isMounted}
                        />
                    )}
                    <GameChoices
                        key={currentStateId}
                        currentState={currentState}
                        disabled={currentTransitionState?.status === "exiting"}
                        transitionStatus={currentTransitionState?.status}
                        isMounted={!!currentTransitionState?.isMounted}
                    />
                    {footerWidgetsShown.length > 0 && (
                        <div className="footer-widgets position-relative">
                            {footerWidgetsShown}
                        </div>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
}
