import { useRef } from "preact/hooks";
import Card from "react-bootstrap/Card";
import { useTransitionMap } from "react-transition-state";

import { getUseStoryStore } from "../shared/game-state";
import {
    footerWidgets,
    headerWidgets as headerWidgetsMap,
    keyWidgets,
    knotWidgets as knotWidgetsMap,
} from "../shared/widgets";
import GameChoices from "./GameChoices";
import GameText from "./GameText";

export function Game({ context }: { context?: "game" | "screen" }) {
    const useStoryStore = getUseStoryStore();
    const gameId = useStoryStore((state) => state.id);
    const currentState = useStoryStore((state) => state.currentState);
    let previousState = useStoryStore((state) => state.previousState);
    const ref = useRef<HTMLDivElement>(null);
    const { toggle, setItem, stateMap, deleteItem } = useTransitionMap<string>({
        unmountOnExit: true,
        timeout: 300,
        preEnter: true,
        preExit: true,
    });

    const previousStateId = previousState?.id
        ? `${gameId}-${previousState?.id}-${context ?? "game"}`
        : undefined;
    const currentStateId = currentState?.id
        ? `${gameId}-${currentState?.id}-${context ?? "game"}`
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
            if (ref.current) {
                ref.current.scrollTo({
                    top: 0,
                    behavior: "auto",
                });
            }
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
                        context={context ?? "game"}
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
                        context={context ?? "game"}
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
                        context={context ?? "game"}
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
                        context={context ?? "game"}
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
                        context={context ?? "game"}
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
                        context={context ?? "game"}
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
        <div
            className={context === "screen" ? "game-screen" : "game-container"}
        >
            <Card ref={ref}>
                {headerWidgets.length > 0 && (
                    <div className="header-widgets position-relative">
                        {headerWidgets}
                    </div>
                )}
                <Card.Body>
                    {knotWidgets}
                    {previousState && (
                        <GameText
                            key={previousStateId}
                            currentState={previousState}
                            transitionStatus={previousTransitionState?.status}
                            isMounted={!!previousTransitionState?.isMounted}
                            context={context ?? "game"}
                        />
                    )}
                    <GameText
                        key={currentStateId}
                        currentState={currentState}
                        transitionStatus={currentTransitionState?.status}
                        isMounted={!!currentTransitionState?.isMounted}
                        context={context ?? "game"}
                    />

                    <div className="clearfix" />

                    {previousState && (
                        <GameChoices
                            key={previousStateId}
                            currentState={previousState}
                            disabled={
                                previousTransitionState?.status === "exiting"
                            }
                            transitionStatus={previousTransitionState?.status}
                            isMounted={!!previousTransitionState?.isMounted}
                            context={context ?? "game"}
                        />
                    )}
                    <GameChoices
                        key={currentStateId}
                        currentState={currentState}
                        disabled={currentTransitionState?.status === "exiting"}
                        transitionStatus={currentTransitionState?.status}
                        isMounted={!!currentTransitionState?.isMounted}
                        context={context ?? "game"}
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
