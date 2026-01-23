import { useState } from "preact/hooks";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import { getUseStoryStore } from "../shared/game-state";
import { SaveModal } from "./SaveModal";

export function NewGameModal({
    show,
    handleClose,
}: {
    show: boolean;
    handleClose: () => void;
}) {
    const [showSaveModal, setShowSaveModal] = useState(false);
    const useStoryStore = getUseStoryStore();
    const startNewGame = useStoryStore((state) => state.startNewGame);

    const handleNewGame = async () => {
        startNewGame();
        handleClose();
    };

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Start New Game?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Would you like to save your progress before starting a new
                    game?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="tertiary" onClick={handleClose}>
                        Resume Game
                    </Button>
                    <Button variant="danger" onClick={handleNewGame}>
                        Discard
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => setShowSaveModal(true)}
                    >
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
            <SaveModal
                show={showSaveModal}
                handleClose={() => setShowSaveModal(false)}
                onSave={handleNewGame}
            />
        </>
    );
}
