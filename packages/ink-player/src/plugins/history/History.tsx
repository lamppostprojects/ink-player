import DownloadIcon from "bootstrap-icons/icons/download.svg?react";
import { useEffect } from "preact/hooks";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Stack from "react-bootstrap/Stack";

import { downloadHTMLLog } from "../../game/download-log";
import HistoryGrouped from "./HistoryGrouped";
import { createPlugin } from "../../shared/plugins";
import type { HistorySettings } from "./types";

export default createPlugin<HistorySettings>(({ settings, useStoryStore }) => {
    return {
        type: "history",
        page() {
            const gameState = useStoryStore((state) => state.gameState);

            useEffect(() => {
                window.scrollTo(0, document.body.scrollHeight);
            }, []);

            return (
                <Card className="mb-3">
                    <Card.Body>
                        <Stack direction="horizontal" gap={3}>
                            <h1>History</h1>
                            {!settings.hideDownloadButton && (
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
                            )}
                        </Stack>
                        <hr />
                        <HistoryGrouped gameState={gameState} settings={settings} />
                        {!settings.hideDownloadButton && (
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
                        )}
                    </Card.Body>
                </Card>
            );
        },
    };
});
