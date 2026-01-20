import DownloadIcon from "bootstrap-icons/icons/download.svg?react";
import { useEffect } from "preact/hooks";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Stack from "react-bootstrap/Stack";

import { getUseStoryStore } from "../shared/game-state";
import { downloadHTMLLog } from "./download-log";
import HistoryGrouped from "./HistoryGrouped";

export default function History() {
    const useStoryStore = getUseStoryStore();
    const gameState = useStoryStore((state) => state.gameState);

    useEffect(() => {
        window.scrollTo(0, document.body.scrollHeight);
    }, []);

    return (
        <Card className="mb-3">
            <Card.Body>
                <Stack direction="horizontal" gap={3}>
                    <h1>History</h1>
                    <Button
                        size="sm"
                        type="button"
                        variant="tertiary"
                        className="ms-auto"
                        onClick={() => downloadHTMLLog(gameState)}
                    >
                        <DownloadIcon className="bi bi-download" /> Download
                        HTML Log
                    </Button>
                </Stack>
                <hr />
                <HistoryGrouped gameState={gameState} />
                <Stack direction="horizontal" gap={3} className="mt-3">
                    <Button
                        size="sm"
                        type="button"
                        variant="tertiary"
                        className="ms-auto"
                        onClick={() => downloadHTMLLog(gameState)}
                    >
                        <DownloadIcon className="bi bi-download" /> Download
                        HTML Log
                    </Button>
                </Stack>
            </Card.Body>
        </Card>
    );
}
