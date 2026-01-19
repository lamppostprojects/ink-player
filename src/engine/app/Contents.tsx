import { useCallback } from "preact/hooks";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import { Helmet } from "react-helmet-async";

import { Game } from "../game/Game";
import History from "../history/History";
import { getSettings } from "../shared/settings";
import type { ScreenProps } from "../shared/types";
import { screenWidgets } from "../shared/widgets";

const getPageComponent = ({
    component,
}: {
    component: string | ((props: ScreenProps) => React.ReactNode);
}) => {
    if (component === "Game") {
        return Game;
    } else if (component === "History") {
        return History;
    } else if (typeof component === "string" && screenWidgets.get(component)) {
        return screenWidgets.get(component);
    } else if (typeof component === "function") {
        return component;
    }
    return null;
};

const Contents = (props: ScreenProps) => {
    const { page, setPage, loading } = props;
    const { screens, enableGameScreen } = getSettings();

    const handlePageChange = useCallback(
        (page: string) => {
            return (e: React.MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault();
                setPage(page);
            };
        },
        [setPage],
    );

    const pageTitle = screens.find((screen) => screen.id === page)?.title;

    return (
        <Container style={{ position: "relative" }}>
            <Helmet>
                <title>{pageTitle}</title>
            </Helmet>
            <Tab.Container defaultActiveKey="game">
                <Row className="pb-3">
                    {enableGameScreen && <Game context="screen" />}
                    <Col
                        className="sidebar d-none d-lg-block position-fixed"
                        sm={3}
                        style={{
                            width: 170,
                            marginLeft: -150,
                        }}
                    >
                        <Nav variant="pills" className="flex-column">
                            {screens.map((screen) => (
                                <Nav.Item
                                    key={screen.id}
                                    style={{ textAlign: "right" }}
                                >
                                    <Nav.Link
                                        eventKey={screen.id}
                                        href={`?page=${screen.id}`}
                                        active={page === screen.id}
                                        onClick={handlePageChange(screen.id)}
                                        disabled={loading}
                                    >
                                        {screen.title}
                                    </Nav.Link>
                                </Nav.Item>
                            ))}
                        </Nav>
                    </Col>
                    <Col sm={12}>
                        <Tab.Content>
                            {screens.map((screen) => (
                                <Tab.Pane
                                    key={screen.id}
                                    eventKey={screen.id}
                                    active={page === screen.id}
                                >
                                    {getPageComponent({
                                        component: screen.component,
                                    })?.(props)}
                                </Tab.Pane>
                            ))}
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        </Container>
    );
};

export default Contents;
