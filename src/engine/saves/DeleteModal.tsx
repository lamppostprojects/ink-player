import Button from "react-bootstrap/button";
import Modal from "react-bootstrap/modal";

import { getUseSavedGamesStore } from "../shared/saved-games";
import type { SavedGame } from "../shared/types";

export function DeleteModal({
    show,
    handleClose,
    savedGame,
}: {
    show: boolean;
    handleClose: () => void;
    savedGame: SavedGame;
}) {
    const useSavedGamesStore = getUseSavedGamesStore();
    const deleteSavedGame = useSavedGamesStore(
        (state) => state.deleteSavedGame,
    );

    const handleDelete = async () => {
        deleteSavedGame(savedGame.id);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Delete Game?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to delete "{savedGame.title}"?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="tertiary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                    Delete
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
