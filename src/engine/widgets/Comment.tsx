import CommentIcon from "bootstrap-icons/icons/chat-dots.svg?react";
import { useCallback, useRef, useState } from "preact/hooks";
import Alert from "react-bootstrap/Alert";
import CloseButton from "react-bootstrap/CloseButton";
import Form from "react-bootstrap/esm/Form";
import Nav from "react-bootstrap/Nav";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import Stack from "react-bootstrap/Stack";

import { getUseStoryStore } from "../shared/game-state";
import { getUseSavedGamesStore } from "../shared/saved-games";
import type {
    ScreenProps,
    WidgetHeaderProps,
    WidgetLogProps,
    WidgetRegistry,
} from "../shared/types";
import { getWidgetSettings } from "../shared/widgets";

const CommentHistory = ({ context, currentState }: WidgetHeaderProps) => {
    const settings = getWidgetSettings("comment");
    if (!settings?.enabled) {
        return null;
    }

    if (context !== "history") {
        return null;
    }

    const comment = currentState?.widgets?.comment ?? "";

    if (!comment) {
        return null;
    }
    return (
        <Alert variant="success">
            <strong>Comment:</strong> {comment}
        </Alert>
    );
};

const CommentNav = ({ page }: ScreenProps) => {
    if (page !== "game") {
        return null;
    }
    const settings = getWidgetSettings("comment");
    if (!settings?.enabled) {
        return null;
    }
    const useStoryStore = getUseStoryStore();
    const updateCurrentState = useStoryStore(
        (state) => state.updateCurrentState,
    );
    const currentState = useStoryStore((state) => state.currentState);
    const getSaveState = useStoryStore((state) => state.getSaveState);
    const useSavedGamesStore = getUseSavedGamesStore();
    const autosave = useSavedGamesStore((state) => state.autosave);
    const [open, setOpen] = useState(false);
    const commentRef = useRef<HTMLTextAreaElement>(null);

    const toggleOpen = useCallback(() => {
        setOpen(!open);
    }, [setOpen, open]);

    const handleChange = useCallback(() => {
        if (!currentState) {
            return;
        }
        updateCurrentState({
            ...currentState,
            widgets: {
                ...currentState?.widgets,
                comment: commentRef.current?.value ?? "",
            },
        });
        autosave(getSaveState);
    }, [commentRef, currentState, updateCurrentState]);

    const handleClose = useCallback(() => {
        setOpen(false);
    }, [setOpen]);

    const comment = currentState?.widgets?.comment ?? "";

    const popover = (
        <Popover id="popover-basic">
            <Popover.Header as="h3">
                <Stack direction="horizontal">
                    <span>Comment</span>
                    <CloseButton onClick={handleClose} className="ms-auto" />
                </Stack>
            </Popover.Header>
            <Popover.Body>
                <Form.Control
                    ref={commentRef}
                    name="comment"
                    value={comment}
                    onChange={handleChange}
                    as="textarea"
                    style={{ height: "100px" }}
                    className="mb-2"
                    placeholder="Add a comment"
                />
            </Popover.Body>
        </Popover>
    );

    return (
        <OverlayTrigger
            trigger="click"
            placement="bottom"
            overlay={popover}
            flip={true}
            show={open}
        >
            {({ ...triggerHandler }) => (
                <Nav.Link
                    {...triggerHandler}
                    onClick={toggleOpen}
                    className="position-relative"
                >
                    {comment && (
                        <span
                            className="position-absolute translate-middle p-1 bg-primary border border-light rounded-circle"
                            style={{
                                top: `var(--bs-nav-link-padding-y)`,
                                right: -3,
                            }}
                        >
                            <span className="visually-hidden">Has Comment</span>
                        </span>
                    )}
                    <CommentIcon className="bi" /> <span>Comment</span>
                </Nav.Link>
            )}
        </OverlayTrigger>
    );
};

const log = (props: WidgetLogProps) => {
    if (!("currentState" in props)) {
        return "";
    }
    const comment = props.currentState.widgets?.comment ?? "";
    if (!comment || props.location === "footer") {
        return "";
    }
    return `<p style="background-color: #f0f0f0; padding: 0.5rem; border-radius: 0.5rem;"><strong>Comment:</strong> ${comment}</p>`;
};

export const commentWidget = {
    type: "comment",
    header: CommentHistory,
    nav: CommentNav,
    log,
    key: () => "comment",
} satisfies WidgetRegistry;
