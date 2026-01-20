import type { ScreenProps } from "@lamppost/ink-player";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";

/**
 * The component is provided with the following props:
 * - setPage: A function to navigate to a different screen
 * - loading: A boolean indicating if the game is loading
 *
 * Use setPage("game") to navigate to the game screen.
 */
export function About({ setPage, loading }: ScreenProps) {
    return (
        <Card>
            {/*
            // You can add an image here and it'll display at the
            // top of the page.
            // import topImage from "./assets/images/top-image.jpg";
            <Card.Img
                variant="top"
                src={topImage}
                alt="LampPost Player top image"
            />
            */}
            <Card.Body>
                {/* You can put anything else you want in here! */}
                <Button
                    variant="primary"
                    size="lg"
                    onClick={() => setPage("game")}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Spinner animation="border" size="sm" /> Loading...
                        </>
                    ) : (
                        "Start Playing"
                    )}
                </Button>
            </Card.Body>
        </Card>
    );
}
