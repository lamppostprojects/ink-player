import { useCallback, useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";

import type {
    WidgetChoiceProps,
    WidgetLogProps,
    WidgetRegistry,
} from "../shared/types";

function TextInput({
    context,
    input,
    output,
    onCompletion,
    autoFocus,
    disabled,
}: WidgetChoiceProps) {
    const { name, label, submitLabel } = input;
    const inputRef = useRef<HTMLInputElement>(null);
    const [value, setValue] = useState("");

    const handleSubmit = useCallback(
        (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            if (disabled) {
                return;
            }
            const value = inputRef.current?.value ?? "";
            if (value) {
                onCompletion({
                    output: { value },
                    variables: { [name]: value },
                });
            }
        },
        [onCompletion, name, disabled],
    );

    const handleChange = useCallback(() => {
        setValue(inputRef.current?.value ?? "");
    }, []);

    useEffect(() => {
        if (autoFocus && !disabled) {
            inputRef.current?.focus({ preventScroll: true });
        }
    }, [autoFocus, disabled]);

    if (context === "history") {
        return log({ input: { label }, output });
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-2">
                {label && (
                    <Form.Label htmlFor={name} className="fw-bold">
                        {label}
                    </Form.Label>
                )}
                <Stack direction="horizontal" gap={2}>
                    <Form.Control
                        type="text"
                        id={name}
                        name={name}
                        ref={inputRef}
                        onChange={handleChange}
                        autoComplete="off"
                        disabled={disabled}
                    />
                    <Button type="submit" disabled={!value || disabled}>
                        {submitLabel || "Submit"}
                    </Button>
                </Stack>
            </Form.Group>
        </Form>
    );
}

const log = (props: WidgetLogProps) => {
    if (!("input" in props)) {
        return "";
    }
    const {
        input: { label },
        output,
    } = props;
    return `${label ? `${label} ` : ""}${output?.value || "[Empty Text Input]"}`;
};

export const textInputWidget = {
    type: "text-input",
    log,
    choice: TextInput,
} satisfies WidgetRegistry;
