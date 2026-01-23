import UploadIcon from "bootstrap-icons/icons/upload.svg?react";
import { useState } from "preact/hooks";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Stack from "react-bootstrap/Stack";

import { getUseStoryStore } from "../shared/game-state";
import { getUseSavedGamesStore } from "../shared/saved-games";
import type { SavedGame } from "../shared/types";
import { DeleteModal } from "./DeleteModal";

export function LoadModal({
    show,
    handleClose,
}: {
    show: boolean;
    handleClose: () => void;
}) {
    const useSavedGamesStore = getUseSavedGamesStore();
    const savedGames = useSavedGamesStore((state) => state.savedGames);
    const useStoryStore = getUseStoryStore();
    const loadSavedGame = useStoryStore((state) => state.loadSavedGame);
    const reversedSavedGames = savedGames
        ? Array.from(savedGames).reverse()
        : [];
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [savedGame, setSavedGame] = useState<SavedGame | null>(null);

    const handleLoad = (game: SavedGame) => {
        loadSavedGame(game);
        handleClose();
    };

    const handleDelete = (game: SavedGame) => {
        setShowDeleteModal(true);
        setSavedGame(game);
    };

    // More info:
    // https://developer.mozilla.org/en-US/docs/Web/API/FileReader
    const loadFromLocalJSONFile = () => {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = ".json";
        fileInput.onchange = () => {
            const file = fileInput.files?.[0];
            if (!file) {
                return;
            }
            const reader = new FileReader();
            reader.onload = () => {
                const json = JSON.parse(reader.result as string);
                loadSavedGame(json);
                handleClose();
            };
            reader.readAsText(file);
        };
        fileInput.click();
    };

    const hasInBrowserSaves = savedGames && savedGames.length > 0;

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Load Game</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Stack direction="vertical" gap={2}>
                    {!hasInBrowserSaves && (
                        <p>
                            You don't currently have any saves in your browser.
                            Once you save your game, it will show up here.
                            Alternatively, you can load a previously-saved file
                            to restore your game.
                        </p>
                    )}
                    {hasInBrowserSaves &&
                        reversedSavedGames.map((game) => (
                            <Card key={`save-card-${game.id}`}>
                                <Card.Body>
                                    <Stack direction="horizontal" gap={3}>
                                        <Stack direction="vertical">
                                            <Card.Title>
                                                {game.title}
                                            </Card.Title>
                                            <Card.Text>
                                                Progress: {game.steps} choices
                                                made. {game.date}
                                            </Card.Text>
                                        </Stack>
                                        <Stack direction="vertical" gap={1}>
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={async () => {
                                                    handleLoad(game);
                                                }}
                                            >
                                                Load
                                            </Button>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={async () => {
                                                    handleDelete(game);
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </Stack>
                                    </Stack>
                                </Card.Body>
                            </Card>
                        ))}
                </Stack>
                {savedGame && (
                    <DeleteModal
                        show={showDeleteModal}
                        handleClose={() => setShowDeleteModal(false)}
                        savedGame={savedGame}
                    />
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant={hasInBrowserSaves ? "secondary" : "primary"}
                    onClick={loadFromLocalJSONFile}
                >
                    <UploadIcon className="bi bi-upload" /> Load Save File
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
