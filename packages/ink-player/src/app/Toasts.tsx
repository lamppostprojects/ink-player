import { useMemo, useState } from "preact/hooks";
import Toast from "react-bootstrap/esm/Toast";
import ToastContainer from "react-bootstrap/esm/ToastContainer";

import { getUseStoryStore } from "../shared/game-state";
import { getPluginsByType } from "../shared/plugins";
import type { PageProps } from "../shared/types";

function ToastItem({
    title,
    description,
    page,
    setPage,
}: {
    title: React.ReactNode;
    description: React.ReactNode;
    page?: string;
    setPage: (page: string) => void;
}) {
    const [show, setShow] = useState(true);

    return (
        <Toast
            show={show}
            onClose={() => setShow(false)}
            autohide
            delay={10000}
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
        const newToasts: {
            id: string;
            page?: string;
            title: React.ReactNode;
            description: React.ReactNode;
        }[] = [];
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
                <ToastItem
                    key={toast.id}
                    title={toast.title}
                    description={toast.description}
                    page={toast.page}
                    setPage={setPage}
                />
            ))}
        </ToastContainer>
    );
}
