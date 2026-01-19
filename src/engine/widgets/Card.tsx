import { useCallback, useEffect, useRef } from "preact/hooks";

import { createPlugin } from "../shared/plugins";

interface CardSettings {
    images: Record<string, string | React.FunctionComponent<any>>;
}

export default createPlugin<CardSettings>(({ settings }) => {
    return {
        type: "card",
        log(props) {
            if (!("input" in props)) {
                return "";
            }
            return props.input.title;
        },
        choice({ context, input, onCompletion, autoFocus, disabled }) {
            const { icon, title, description, height: cardHeight } = input;
            const buttonRef = useRef<HTMLButtonElement>(null);
            const cardImages = settings.images;

            const handleClick = useCallback(
                (event: React.MouseEvent<HTMLButtonElement>) => {
                    event.preventDefault();
                    if (disabled) {
                        return;
                    }
                    onCompletion({});
                },
                [onCompletion, disabled],
            );

            useEffect(() => {
                if (autoFocus && !disabled) {
                    buttonRef.current?.focus({ preventScroll: true });
                }
            }, [autoFocus, disabled]);

            if (icon && !cardImages) {
                return null;
            }

            if (context === "history") {
                return input.title;
            }

            const cardImage = cardImages?.[icon as keyof typeof cardImages];
            const Icon = cardImage;
            const defaultHeight = "100px";
            const height = cardHeight || defaultHeight;

            return (
                <button
                    type="button"
                    ref={buttonRef}
                    onClick={handleClick}
                    disabled={disabled}
                >
                    <div
                        className="card position-relative overflow-hidden"
                        style={{ height }}
                    >
                        <div className="d-flex flex-row">
                            {cardImage && (
                                <div className="">
                                    {typeof Icon === "string" ? (
                                        <img
                                            src={Icon}
                                            className="rounded-start"
                                            style={{ height, width: "auto" }}
                                            alt={title}
                                        />
                                    ) : (
                                        <div
                                            style={{
                                                width: "100%",
                                                height,
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                padding: "10px",
                                            }}
                                        >
                                            <Icon
                                                className="img-fluid"
                                                style={{
                                                    width: "100%",
                                                    height,
                                                    objectFit: "contain",
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                            <div className="">
                                <div className="card-body">
                                    <h5 className="card-title">{title}</h5>
                                    {description && (
                                        <p
                                            className="card-text text-muted text-body-secondary small"
                                            // biome-ignore lint/security/noDangerouslySetInnerHtml: We want to render the HTML
                                            dangerouslySetInnerHTML={{
                                                __html: description,
                                            }}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </button>
            );
        },
        async preload() {
            return Promise.all(
                Object.values(settings.images).map((image) => {
                    return new Promise((resolve) => {
                        if (typeof image === "string") {
                            const cardImg = new Image();
                            cardImg.src = image;
                            cardImg.onload = () => resolve(undefined);
                        } else {
                            resolve(undefined);
                        }
                    });
                }),
            );
        },
    };
});
