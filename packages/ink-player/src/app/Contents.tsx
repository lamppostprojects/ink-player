import { useCallback } from "preact/hooks";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import { Helmet } from "react-helmet-async";

import { Game } from "../game/Game";
import { getPluginsByType } from "../shared/plugins";
import { getSettings } from "../shared/settings";
import type { PageProps } from "../shared/types";

const getPageComponent = ({
    component,
}: {
    component: string | ((props: PageProps) => React.ReactNode);
}) => {
    if (component === "game") {
        return Game;
    } else if (typeof component === "string") {
        const pageWidgets = getPluginsByType("page");
        return pageWidgets.get(component);
    } else if (typeof component === "function") {
        return component;
    }
    return null;
};

const Contents = (props: PageProps) => {
    const { page: currentPage, setPage, loading } = props;
    const { pages, enableGameScreen } = getSettings();

    const handlePageChange = useCallback(
        (page: string) => {
            return (e: React.MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault();
                setPage(page);
            };
        },
        [setPage],
    );

    const pageTitle = pages.find((page) => page.id === currentPage)?.title;

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
                            {pages.map((page) => (
                                <Nav.Item
                                    key={page.id}
                                    style={{ textAlign: "right" }}
                                >
                                    <Nav.Link
                                        eventKey={page.id}
                                        href={`?page=${page.id}`}
                                        active={currentPage === page.id}
                                        onClick={handlePageChange(page.id)}
                                        disabled={loading}
                                    >
                                        {page.title}
                                    </Nav.Link>
                                </Nav.Item>
                            ))}
                        </Nav>
                    </Col>
                    <Col sm={12}>
                        <Tab.Content>
                            {pages.map((page) => (
                                <Tab.Pane
                                    key={page.id}
                                    eventKey={page.id}
                                    active={currentPage === page.id}
                                >
                                    {getPageComponent({
                                        component: page.component,
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
