import { useCallback, useEffect, useRef } from "react";

import type {
    WidgetChoiceProps,
    WidgetLogProps,
    WidgetRegistry,
} from "../shared/types";
import { getWidgetSettings } from "../shared/widgets";

function Card({
    context,
    input,
    onCompletion,
    autoFocus,
    disabled,
}: WidgetChoiceProps) {
    const { icon, title, description, height: cardHeight } = input;
    const buttonRef = useRef<HTMLButtonElement>(null);
    const cardImages = getWidgetSettings("card");

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
        return log({ input });
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
                            {typeof cardImage === "string" ? (
                                <img
                                    src={cardImage}
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
}

const log = ({ input: { title } }: WidgetLogProps) => {
    return title;
};

const preload = async () => {
    const cardImages = getWidgetSettings("card");

    if (!cardImages) {
        return;
    }

    return Promise.all(
        Object.values(cardImages).map((card) => {
            return new Promise((resolve) => {
                if (typeof card === "string") {
                    const cardImg = new Image();
                    cardImg.src = card;
                    cardImg.onload = () => resolve(undefined);
                } else {
                    resolve(undefined);
                }
            });
        }),
    );
};

export const cardWidget = {
    type: "card",
    log,
    choice: Card,
    preload,
} satisfies WidgetRegistry;
