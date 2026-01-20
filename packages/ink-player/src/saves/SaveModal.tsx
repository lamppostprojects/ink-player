import DownloadIcon from "bootstrap-icons/icons/download.svg?react";
import SaveIcon from "bootstrap-icons/icons/save.svg?react";
import { useRef } from "preact/hooks";
import Button from "react-bootstrap/button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/modal";

import { getUseStoryStore } from "../shared/game-state";
import { getUseSavedGamesStore } from "../shared/saved-games";
import { getSettings } from "../shared/settings";

export function SaveModal({
    show,
    handleClose,
    onSave,
}: {
    show: boolean;
    handleClose: () => void;
    onSave?: () => void;
}) {
    const saveNameRef = useRef<HTMLInputElement>(null);
    const useStoryStore = getUseStoryStore();
    const story = useStoryStore((state) => state.story);
    const gameState = useStoryStore((state) => state.gameState);
    const useSavedGamesStore = getUseSavedGamesStore();
    const addSavedGame = useSavedGamesStore((state) => state.addSavedGame);
    const getSaveState = useStoryStore((state) => state.getSaveState);
    const localSaveOnly = useSavedGamesStore(
        (state) => !state.canSaveInLocalStorage(),
    );
    const currentState = useStoryStore((state) => state.currentState);
    const settings = getSettings();
    const { shortGameName, gameName } = settings;

    const handleSave = () => {
        if (!gameState || !story) {
            return;
        }
        const saveState = getSaveState({
            title: saveNameRef.current?.value ?? "",
        });
        if (saveState) {
            addSavedGame(saveState);
        }
        onSave?.();
        handleClose();
    };

    const downloadJSON = () => {
        if (!gameState || !story) {
            return;
        }
        const saveState = getSaveState({
            title: saveNameRef.current?.value ?? "",
        });
        if (!saveState) {
            return;
        }
        const blob = new Blob([JSON.stringify(saveState)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${shortGameName || gameName}-save-${new Date().toISOString()}.json`;
        a.click();
        onSave?.();
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Save Game</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Label htmlFor="saveName">
                    <strong>Save Name</strong>
                </Form.Label>
                <Form.Control
                    ref={saveNameRef}
                    type="text"
                    id="saveName"
                    aria-describedby="saveNameHelpBlock"
                    value={
                        saveNameRef.current?.value ??
                        (currentState && settings.defaultSaveName
                            ? settings.defaultSaveName(currentState)
                            : "Untitled Save")
                    }
                />
                <br />
                {!localSaveOnly && (
                    <>
                        <p>
                            <Button
                                variant="primary"
                                onClick={handleSave}
                                disabled={localSaveOnly}
                            >
                                <SaveIcon className="bi bi-save" /> Save to
                                Browser Storage
                            </Button>
                        </p>
                        <p>
                            You can save your game to your browser's local
                            storage. This is the recommended way to save your
                            game. Warning: If you clear your browser's storage,
                            you will lose your saves.
                        </p>
                        <hr />
                    </>
                )}
                <p>
                    {localSaveOnly
                        ? "Download a file to save your game to your disk."
                        : "Alternatively, you can download a file to save your game to your disk."}
                </p>
                <p>
                    <Button
                        variant={localSaveOnly ? "primary" : "secondary"}
                        onClick={downloadJSON}
                    >
                        <DownloadIcon className="bi bi-download" /> Export Save
                        File
                    </Button>
                </p>
            </Modal.Body>
        </Modal>
    );
}
