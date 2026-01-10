import { Fragment } from "react";

import type { GameState } from "../shared/types";
import { footerWidgets, headerWidgets } from "../shared/widgets";
import HistoryChoices from "./HistoryChoices";
import HistoryText from "./HistoryText";

export default function HistoryGameState({
    currentState,
}: {
    currentState: GameState;
}) {
    const header = [];

    for (const HeaderWidget of headerWidgets.values()) {
        header.push(
            <HeaderWidget
                context="history"
                currentState={currentState}
                transitionStatus={undefined}
            />,
        );
    }

    const footer = [];

    for (const FooterWidget of footerWidgets.values()) {
        footer.push(
            <FooterWidget
                context="history"
                currentState={currentState}
                transitionStatus={undefined}
            />,
        );
    }

    return (
        <Fragment key={currentState.id}>
            {header}
            <HistoryText currentState={currentState} />
            <HistoryChoices currentState={currentState} />
            {footer}
            <hr />
        </Fragment>
    );
}
