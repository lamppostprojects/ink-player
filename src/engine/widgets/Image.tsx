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

function ImageText({ input }: WidgetTextProps) {
    const [showImageModal, setShowImageModal] = useState(false);
    const images = getWidgetSettings("images");
    const image = images?.[input.name as keyof typeof images];
    if (!image || !image.small) {
        return null;
    }

    const alt = input.alt || `Image: ${input.name}`;
    const renderedImage = (
        <BootstrapImage
            fluid
            thumbnail
            src={image.small}
            alt={alt}
            className={
                input.align === "left"
                    ? "float-start mr-4 mb-4"
                    : input.align === "right"
                      ? "float-end ml-4 mb-4"
                      : "mx-auto d-block mb-4"
            }
        />
    );

    if (!image.large) {
        return renderedImage;
    }

    return (
        <>
            <a
                href={`?image=${input.name}`}
                onClick={(e) => {
                    setShowImageModal(true);
                    e.preventDefault();
                }}
            >
                {renderedImage}
            </a>
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
                <BootstrapImage fluid src={image.large} alt={alt} />
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
    return `<p>[Image: ${props.input.alt}]</p>`;
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
