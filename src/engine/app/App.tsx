import { useQueryState } from "nuqs";
import { useCallback, useEffect } from "preact/hooks";
import { Helmet, HelmetProvider } from "react-helmet-async";

import { getUseStoryStore } from "../shared/game-state";
import { getUseSavedGamesStore } from "../shared/saved-games";
import { getSettings } from "../shared/settings";
import Contents from "./Contents";
import Header from "./Header";
import { Toasts } from "./Toasts";

const App = () => {
    const settings = getSettings();
    const { screens } = settings;
    const [page, setQueryPage] = useQueryState("page", {
        scroll: true,
        history: "push",
        defaultValue: screens[0].id,
    });
    const useStoryStore = getUseStoryStore();
    const loadStoryData = useStoryStore((state) => state.loadStoryData);
    const useSavedGamesStore = getUseSavedGamesStore();
    const getMostRecentSavedGame = useSavedGamesStore(
        (state) => state.getMostRecentSavedGame,
    );
    const loadSavedGame = useStoryStore((state) => state.loadSavedGame);
    const startNewGame = useStoryStore((state) => state.startNewGame);
    const gameState = useStoryStore((state) => state.gameState);
    const loading = gameState.length === 0;

    const setPage = useCallback(
        (page: string) => {
            // Remove the hash from the URL
            history.replaceState(null, "", window.location.href.split("#")[0]);
            setQueryPage(page);
        },
        [setQueryPage],
    );

    useEffect(() => {
        async function init() {
            await loadStoryData();
            const mostRecentSavedGame = getMostRecentSavedGame();
            if (mostRecentSavedGame) {
                loadSavedGame(mostRecentSavedGame);
                if (page === screens[0].id) {
                    setPage("game");
                }
            } else {
                startNewGame();
            }
        }
        init();
    }, [
        loadStoryData,
        getMostRecentSavedGame,
        loadSavedGame,
        startNewGame,
        setPage,
    ]);

    return (
        <HelmetProvider>
            <Helmet titleTemplate={`${settings.gameName}: %s`}>
                {settings.favicon && (
                    <link
                        rel="icon"
                        type="image/x-icon"
                        href={settings.favicon}
                    />
                )}
            </Helmet>
            <Header page={page} setPage={setPage} loading={loading} />
            <Contents page={page} setPage={setPage} loading={loading} />
            <Toasts page={page} setPage={setPage} loading={loading} />
        </HelmetProvider>
    );
};

export default App;
