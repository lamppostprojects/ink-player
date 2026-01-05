import ArrowLeftIcon from "bootstrap-icons/icons/arrow-left.svg?react";
import { useCallback } from "preact/hooks";
import Nav from "react-bootstrap/Nav";

import { useStoryStore } from "../shared/game-state";
import { useSavedGamesStore } from "../shared/saved-games";
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
    const numStates = useStoryStore((state) => state.gameState.length);
    const back = useStoryStore((state) => state.back);
    const autosave = useSavedGamesStore((state) => state.autosave);

    const handleBack = useCallback(() => {
        back();
        autosave();
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
