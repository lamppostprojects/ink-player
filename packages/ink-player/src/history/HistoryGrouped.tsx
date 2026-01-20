import { useMemo, useState } from "preact/hooks";
import Accordion from "react-bootstrap/Accordion";

import type { GameState } from "../shared/types";
import HistoryGameState from "./HistoryGameState";

type Group = {
    id: string;
    title: string;
    states: GameState[];
};

// TODO: Change this once it's in a plugin
const historySettings: {
    groupBy: (currentState: GameState) => { id: string; title: string };
} = {
    groupBy: (currentState: GameState) => ({
        id: currentState.tags.Location,
        title: currentState.tags.Location ?? "Unknown Location",
    }),
};

export default function HistoryGrouped({
    gameState,
}: {
    gameState: GameState[];
}) {
    const [expanded, setExpanded] = useState<string[]>([]);

    if (!historySettings?.groupBy) {
        return gameState.map((currentState) => {
            return (
                <HistoryGameState
                    key={currentState.id}
                    currentState={currentState}
                />
            );
        });
    }

    const handleSelect = (eventKey: string | string[] | null | undefined) => {
        setExpanded(
            eventKey ? (Array.isArray(eventKey) ? eventKey : [eventKey]) : [],
        );
    };

    const groups = useMemo(() => {
        const groups: Group[] = [];

        let currentGroup: Group | null = null;

        for (const currentState of gameState) {
            const group = historySettings.groupBy(currentState);
            if (currentGroup && group.id !== currentGroup.id) {
                if (currentGroup) {
                    groups.push(currentGroup);
                }
                currentGroup = {
                    id: group.id,
                    title: group.title,
                    states: [],
                };
            }
            if (currentGroup) {
                currentGroup.states.push(currentState);
            }
        }

        if (currentGroup) {
            groups.push(currentGroup);
        }

        return groups;
    }, [gameState, historySettings]);

    return (
        <Accordion
            alwaysOpen
            flush
            activeKey={expanded}
            onSelect={handleSelect}
        >
            {groups.map((group) => {
                if (!group.id) {
                    return null;
                }
                const id = `${group.id}-${group.states[0].id}`;
                return (
                    <Accordion.Item key={id} eventKey={id}>
                        <Accordion.Header>
                            <strong>{group.title}</strong>
                        </Accordion.Header>
                        <Accordion.Body>
                            {group.states.map((state) => {
                                return (
                                    <HistoryGameState
                                        key={state.id}
                                        currentState={state}
                                    />
                                );
                            })}
                        </Accordion.Body>
                    </Accordion.Item>
                );
            })}
        </Accordion>
    );
}
