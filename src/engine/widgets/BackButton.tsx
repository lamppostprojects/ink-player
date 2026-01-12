import ArrowLeftIcon from "bootstrap-icons/icons/arrow-left.svg?react";
import { useCallback } from "preact/hooks";
import Nav from "react-bootstrap/Nav";

import { getUseStoryStore } from "../shared/game-state";
import { getUseSavedGamesStore } from "../shared/saved-games";
import type { ScreenProps, WidgetRegistry } from "../shared/types";
import { getWidgetSettings } from "../shared/widgets";

const BackButton = ({ page }: ScreenProps) => {
    if (page !== "game") {
        return null;
    }
    const settings = getWidgetSettings("backButton");
    if (!settings?.enabled) {
        return null;
    }
    const useStoryStore = getUseStoryStore();
    const numStates = useStoryStore((state) => state.gameState.length);
    const back = useStoryStore((state) => state.back);
    const getSaveState = useStoryStore((state) => state.getSaveState);
    const useSavedGamesStore = getUseSavedGamesStore();
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
};

export const backButtonWidget = {
    type: "backButton",
    nav: BackButton,
    key: () => "backButton",
} satisfies WidgetRegistry;
