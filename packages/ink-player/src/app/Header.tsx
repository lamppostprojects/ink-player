import SaveIcon from "bootstrap-icons/icons/save.svg?react";
import { useCallback, useState } from "preact/hooks";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

import { LoadModal } from "../saves/LoadModal";
import { NewGameModal } from "../saves/NewGameModal";
import { SaveModal } from "../saves/SaveModal";
import { getUseStoryStore } from "../shared/game-state";
import { getPluginsByType } from "../shared/plugins";
import { getSettings } from "../shared/settings";
import type { PageProps } from "../shared/types";

function Header(props: PageProps) {
    const settings = getSettings();
    const { pages } = settings;
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [showLoadModal, setShowLoadModal] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [showNewGameModal, setShowNewGameModal] = useState(false);
    const useStoryStore = getUseStoryStore();
    const startNewGame = useStoryStore((state) => state.startNewGame);
    const gameState = useStoryStore((state) => state.gameState);

    const { shortGameName, gameName } = settings;
    const { page: currentPage, setPage } = props;
    const gameIsWorthSaving = gameState && gameState.length > 1;
    const homePage = pages[0].id;

    const handlePageChange = useCallback(
        (page: string) => {
            return (e: React.MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault();
                setExpanded(false);
                setPage(page);
            };
        },
        [setPage],
    );

    const handleNewGame = useCallback(() => {
        setExpanded(false);
        if (!gameIsWorthSaving) {
            startNewGame();
            setPage("game");
        } else {
            setShowNewGameModal(true);
        }
    }, [startNewGame, gameIsWorthSaving]);

    const handleSaveModalClose = useCallback(() => {
        setShowSaveModal(false);
    }, [setShowSaveModal]);

    const handleLoadModalClose = useCallback(() => {
        setShowLoadModal(false);
        setPage("game");
    }, [setPage, setShowLoadModal]);

    const handleNewGameModalClose = useCallback(() => {
        setShowNewGameModal(false);
        setPage("game");
    }, [setPage, setShowNewGameModal]);

    const widgets = Array.from(getPluginsByType("nav").entries());

    return (
        <>
            <Navbar
                collapseOnSelect
                expanded={expanded}
                expand="lg"
                className="bg-body-tertiary justify-content-between"
                fixed="top"
            >
                <Container>
                    <Navbar.Brand
                        href={`?page=${homePage}`}
                        onClick={handlePageChange(homePage)}
                    >
                        {shortGameName || gameName}
                    </Navbar.Brand>
                    <Navbar.Toggle
                        aria-controls="navbar"
                        onClick={() => setExpanded(!expanded)}
                    />
                    <Navbar.Collapse
                        id="navbar"
                        className="justify-content-end"
                    >
                        <Nav>
                            {pages.map((page) => (
                                <Nav.Item key={page.id} className="d-lg-none">
                                    <Nav.Link
                                        eventKey={page.id}
                                        href={`?page=${page.id}`}
                                        active={currentPage === page.id}
                                        onClick={handlePageChange(page.id)}
                                    >
                                        {page.title}
                                    </Nav.Link>
                                </Nav.Item>
                            ))}
                            {widgets.map(([type, Widget]) => (
                                <Nav.Item key={type} onClick={() => setExpanded(false)}>
                                    <Widget {...props} />
                                </Nav.Item>
                            ))}
                            <Nav.Item>
                                <NavDropdown
                                    title={
                                        <>
                                            <SaveIcon className="bi bi-save" />{" "}
                                            Saves
                                        </>
                                    }
                                    id="game-dropdown"
                                >
                                    <NavDropdown.Item
                                        href=""
                                        onClick={handleNewGame}
                                        disabled={!gameIsWorthSaving}
                                    >
                                        Restart
                                    </NavDropdown.Item>
                                    <NavDropdown.Item
                                        href=""
                                        onClick={() => {
                                            setExpanded(false);
                                            setShowSaveModal(true);
                                        }}
                                        disabled={!gameIsWorthSaving}
                                    >
                                        Save Game
                                    </NavDropdown.Item>
                                    <NavDropdown.Item
                                        href=""
                                        onClick={() => {
                                            setExpanded(false);
                                            setShowLoadModal(true);
                                        }}
                                    >
                                        Load Game
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </Nav.Item>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <SaveModal
                show={showSaveModal}
                handleClose={handleSaveModalClose}
            />
            <LoadModal
                show={showLoadModal}
                handleClose={handleLoadModalClose}
            />
            <NewGameModal
                show={showNewGameModal}
                handleClose={handleNewGameModalClose}
            />
        </>
    );
}

export default Header;
