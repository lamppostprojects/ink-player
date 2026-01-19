import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";

import { createPlugin } from "../shared/plugins";

export default createPlugin(() => ({
    type: "text-input",
    log(props) {
        if (!("input" in props)) {
            return "";
        }
        const {
            input: { label },
            output,
        } = props;
        return `${label ? `${label} ` : ""}${output?.value || "[Empty Text Input]"}`;
    },
    choice({ context, input, output, onCompletion, autoFocus, disabled }) {
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
            return this.log?.({ input: { label }, output }) ?? null;
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
    },
}));
