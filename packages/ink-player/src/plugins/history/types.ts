import type { GameState } from "../../shared/types";

export interface HistorySettings {
    groupBy?: (currentState: GameState) => { id: string; title: string };
    hideDownloadButton?: boolean;
}
