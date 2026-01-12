import { useState } from "react";
import Button from "react-bootstrap/Button";
import BootstrapImage from "react-bootstrap/Image";
import Modal from "react-bootstrap/Modal";

import type {
    WidgetChoiceProps,
    WidgetLogProps,
    WidgetRegistry,
    WidgetTextProps,
} from "../shared/types";
import { getWidgetSettings } from "../shared/widgets";

const ImageWrapper = ({
    children,
    caption,
    source,
    sourceText,
    align = "center",
}: {
    children: React.ReactNode;
    caption?: string;
    source?: string;
    sourceText?: string;
    align?: string;
}) => {
    return (
        <figure
            style={{ display: "table" }}
            className={
                "text-center mb-4 " +
                (align === "left"
                    ? "float-start me-4"
                    : align === "right"
                      ? "float-end ms-4"
                      : "mx-auto")
            }
        >
            {children}
            {(caption || source) && (
                <figcaption
                    style={{ display: "table-caption", captionSide: "bottom" }}
                    className="mt-2 small text-secondary"
                >
                    {caption}{" "}
                    {source && (
                        <>
                            (
                            <a
                                href={source}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {sourceText}
                            </a>
                            )
                        </>
                    )}
                </figcaption>
            )}
        </figure>
    );
};

function ImageText({ input }: WidgetTextProps) {
    const [showImageModal, setShowImageModal] = useState(false);
    const images = getWidgetSettings("images");
    const align = input.align || "center";
    const source = input.source;
    const maxHeight = input.maxHeight
        ? parseFloat(input.maxHeight as string)
        : 400;
    const sourceText = input.sourceText || "Source";
    let small = input.small;

    const image = images?.[input.name as keyof typeof images];
    if ((!image || !image.small) && !small) {
        return null;
    }
    if (!small) {
        small = image?.small;
    }

    const alt = input.alt || (input.name ? `Image: ${input.name}` : "");
    const renderedImage = (
        <BootstrapImage
            fluid
            thumbnail
            src={small}
            alt={alt}
            style={{ maxHeight }}
        />
    );

    const large = input.large || image?.large;

    if (!large) {
        return (
            <ImageWrapper
                caption={input.caption}
                source={source}
                sourceText={sourceText}
                align={align}
            >
                {renderedImage}
            </ImageWrapper>
        );
    }

    return (
        <>
            <ImageWrapper
                caption={input.caption}
                source={source}
                sourceText={sourceText}
                align={align}
            >
                <a
                    href={input.name ? `?image=${input.name}` : "#"}
                    onClick={(e) => {
                        setShowImageModal(true);
                        e.preventDefault();
                    }}
                >
                    {renderedImage}
                </a>
            </ImageWrapper>
            <Modal
                show={showImageModal}
                onHide={() => setShowImageModal(false)}
                onClick={() => setShowImageModal(false)}
                size="lg"
            >
                <Button
                    variant="close"
                    aria-label="Close"
                    style={{ position: "absolute", top: 8, right: 8 }}
                />
                <BootstrapImage fluid src={large} alt={alt} />
            </Modal>
        </>
    );
}

const ImageChoice = ({ context, input }: WidgetChoiceProps) => {
    return <ImageText context={context} input={input} />;
};

const log = (props: WidgetLogProps) => {
    if (!("input" in props)) {
        return "";
    }
    return `<p>[Image: ${props.input.alt || props.input.caption || "Image"}]</p>`;
};

const preload = async () => {
    const images = getWidgetSettings("images");

    if (!images) {
        return;
    }

    return Promise.all(
        Object.values(images).map(({ small }) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.src = small;
                img.onload = resolve;
            });
        }),
    );
};

export const imageWidget = {
    type: "image",
    log,
    text: ImageText,
    choice: ImageChoice,
    preload,
} satisfies WidgetRegistry;
