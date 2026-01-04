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
    const { toggle, setItem, stateMap } = useTransitionMap<string>({
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

    if (previousTransitionState?.status === "exited") {
        previousState = null;
    }

    if (previousStateId && !stateMap.has(previousStateId)) {
        setItem(previousStateId);
    }

    if (currentStateId && !stateMap.has(currentStateId)) {
        if (previousStateId) {
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

    const footer = [];

    for (const FooterWidget of footerWidgets.values()) {
        footer.push(<FooterWidget />);
    }

    return (
        <div className="game-container">
            <Card>
                <div className="position-relative">{headerWidgets}</div>
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
                    <div className="position-relative">{footer}</div>
                </Card.Body>
            </Card>
        </div>
    );
}
