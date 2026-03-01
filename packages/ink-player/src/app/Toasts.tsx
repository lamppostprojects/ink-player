import { useEffect, useMemo, useState } from "preact/hooks";
import Toast from "react-bootstrap/esm/Toast";
import ToastContainer from "react-bootstrap/esm/ToastContainer";

import { getUseStoryStore } from "../shared/game-state";
import { getPluginsByType } from "../shared/plugins";
import type { PageProps, Toast as ToastType } from "../shared/types";

const TOAST_SHOW_DELAY = 2000;
const TOAST_HIDE_DELAY = 7000;

function ToastItem({
    toast,
    setPage,
}: {
    toast: ToastType;
    setPage: (page: string) => void;
}) {
    const { title, description, page, showDelay, hideDelay, autoHide } = toast;
    const [show, setShow] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setShow(true);
        }, showDelay ?? TOAST_SHOW_DELAY);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <Toast
            show={show}
            onClose={() => setShow(false)}
            autohide={autoHide ?? true}
            delay={hideDelay ?? TOAST_HIDE_DELAY}
        >
            <Toast.Header>
                <strong className="me-auto" style={{ fontSize: "1.1rem" }}>
                    {title}
                </strong>
            </Toast.Header>
            <Toast.Body>
                {page ? (
                    <a
                        href={`/?page=${page}`}
                        onClick={(e) => {
                            e.preventDefault();
                            setPage(page);
                            setShow(false);
                        }}
                        className="text-decoration-none"
                    >
                        {description}
                    </a>
                ) : (
                    description
                )}
            </Toast.Body>
        </Toast>
    );
}

export function Toasts({ setPage }: PageProps) {
    const useStoryStore = getUseStoryStore();
    const currentState = useStoryStore((state) => state.currentState);
    const allToasts = useMemo(() => {
        const newToasts: Array<ToastType> = [];
        if (currentState) {
            for (const toastWidget of getPluginsByType("toast").values()) {
                const toasts = toastWidget(currentState);

                for (const toast of toasts) {
                    newToasts.push(toast);
                }
            }
        }
        return newToasts;
    }, [currentState]);

    return (
        <ToastContainer
            className="p-3"
            position="bottom-end"
            style={{ zIndex: 1 }}
        >
            {allToasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} setPage={setPage} />
            ))}
        </ToastContainer>
    );
}
