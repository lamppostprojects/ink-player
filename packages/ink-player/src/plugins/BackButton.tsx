import ArrowLeftIcon from "bootstrap-icons/icons/arrow-left.svg?react";
import { useCallback } from "preact/hooks";
import Nav from "react-bootstrap/Nav";

import { createPlugin } from "../shared/plugins";

type BackButtonSettings = Record<string, never>;

export default createPlugin<BackButtonSettings>(
    ({ useStoryStore, useSavedGamesStore }) => ({
        type: "backButton",
        nav({ page }) {
            if (page !== "game") {
                return null;
            }
            const numStates = useStoryStore((state) => state.gameState.length);
            const back = useStoryStore((state) => state.back);
            const getSaveState = useStoryStore((state) => state.getSaveState);
            const autosave = useSavedGamesStore((state) => state.autosave);

            const handleBack = useCallback(() => {
                back();
                autosave(getSaveState);
            }, [back, autosave]);

            return (
                <Nav.Link
                    onClick={handleBack}
                    disabled={numStates <= 1}
                    className="position-relative"
                >
                    <ArrowLeftIcon className="bi" /> <span>Back</span>
                </Nav.Link>
            );
        },
        key: () => "backButton",
    }),
);
