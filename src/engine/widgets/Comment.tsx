import CommentIcon from "bootstrap-icons/icons/chat-dots.svg?react";
import { useCallback, useRef, useState } from "preact/hooks";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import CloseButton from "react-bootstrap/CloseButton";
import Form from "react-bootstrap/esm/Form";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import Stack from "react-bootstrap/Stack";

import { useStoryStore } from "../shared/game-state";
import { useSavedGamesStore } from "../shared/saved-games";
import type {
    WidgetHeaderProps,
    WidgetLogProps,
    WidgetRegistry,
} from "../shared/types";
import { getWidgetSettings } from "../shared/widgets";

const Comment = ({ context, currentState }: WidgetHeaderProps) => {
    const settings = getWidgetSettings("comment");
    if (!settings?.enabled) {
        return null;
    }
    const updateCurrentState = useStoryStore(
        (state) => state.updateCurrentState,
    );
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
        autosave();
    }, [commentRef, currentState, updateCurrentState]);

    const handleClose = useCallback(() => {
        setOpen(false);
    }, [setOpen]);

    const comment = currentState?.widgets?.comment ?? "";

    if (context === "history") {
        if (!comment) {
            return null;
        }
        return (
            <Alert variant="success">
                <strong>Comment:</strong> {comment}
            </Alert>
        );
    }

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
        <div>
            <OverlayTrigger
                trigger="click"
                placement="bottom"
                overlay={popover}
                flip={true}
                show={open}
            >
                {({ ...triggerHandler }) => (
                    <Button
                        {...triggerHandler}
                        variant="primary"
                        style={{ position: "absolute", top: 0, right: -60 }}
                        onClick={toggleOpen}
                    >
                        {comment && (
                            <span className="position-absolute top-0 start-100 translate-middle p-2 bg-primary border border-light rounded-circle">
                                <span className="visually-hidden">
                                    Has Comment
                                </span>
                            </span>
                        )}
                        <CommentIcon className="bi" />
                        <span className="visually-hidden">Add Comment</span>
                    </Button>
                )}
            </OverlayTrigger>
        </div>
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
    header: Comment,
    log,
} satisfies WidgetRegistry;
