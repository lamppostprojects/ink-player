import DownloadIcon from "bootstrap-icons/icons/download.svg?react";
import { Fragment, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Stack from "react-bootstrap/Stack";

import { useStoryStore } from "../shared/game-state";
import { footerWidgets, headerWidgets } from "../shared/widgets";
import { downloadHTMLLog } from "./download-log";
import HistoryChoices from "./HistoryChoices";
import HistoryText from "./HistoryText";

export default function History() {
    const gameState = useStoryStore((state) => state.gameState);

    useEffect(() => {
        window.scrollTo(0, document.body.scrollHeight);
    }, []);

    const contents: React.ReactNode = gameState.map((state) => {
        const header = [];

        for (const HeaderWidget of headerWidgets.values()) {
            header.push(
                <HeaderWidget
                    context="history"
                    currentState={state}
                    transitionStatus={undefined}
                />,
            );
        }

        const footer = [];

        for (const FooterWidget of footerWidgets.values()) {
            footer.push(
                <FooterWidget
                    context="history"
                    currentState={state}
                    transitionStatus={undefined}
                />,
            );
        }

        return (
            <Fragment key={state.id}>
                {header}
                <HistoryText currentState={state} />
                <HistoryChoices currentState={state} />
                {footer}
                <hr />
            </Fragment>
        );
    });

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
                {contents}
                <Stack direction="horizontal" gap={3}>
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
