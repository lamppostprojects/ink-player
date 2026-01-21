import { useState } from "preact/hooks";
import Button from "react-bootstrap/Button";
import BootstrapImage from "react-bootstrap/Image";
import Modal from "react-bootstrap/Modal";

import { createPlugin } from "../shared/plugins";

interface ImageSettings {
    images: Record<string, { small: string; large?: string }>;
}

const ImageWrapper = ({
    children,
    caption,
    source,
    sourceText,
    align = "center",
    context,
}: {
    children: React.ReactNode;
    caption?: string;
    source?: string;
    sourceText?: string;
    align?: string;
    context: "game" | "history" | "screen";
}) => {
    return (
        <figure
            className={
                "image text-center mb-4 " +
                (context === "screen"
                    ? "mx-auto"
                    : align === "left"
                      ? "float-start me-4"
                      : align === "right"
                        ? "float-end ms-4"
                        : "mx-auto")
            }
        >
            {children}
            {(caption || source) && (
                <figcaption className="mt-2 small">
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

export default createPlugin<ImageSettings>(({ settings, gameSettings }) => ({
    type: "image",
    log(props) {
        if (!("input" in props)) {
            return "";
        }
        return `<p>[Image: ${props.input.alt || props.input.caption || "Image"}]</p>`;
    },
    text({ input, context }) {
        const [showImageModal, setShowImageModal] = useState(false);
        const images = settings.images;
        const align = input.align || "center";
        const source = input.source;
        const maxHeight =
            context === "screen"
                ? undefined
                : input.maxHeight
                  ? parseFloat(input.maxHeight as string)
                  : 400;
        const sourceText = input.sourceText || "Source";
        let small =
            context === "screen" ? input.large || input.small : input.small;

        const image = images?.[input.name as keyof typeof images];
        if ((!image || !image.small) && !small) {
            return null;
        }
        if (!small) {
            small =
                context === "screen"
                    ? image?.large || image?.small
                    : image?.small;
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
                    context={context}
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
                    context={context}
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
    },
    choice({ context, input }) {
        return this.text?.({ context, input }) ?? null;
    },
    async preload() {
        return Promise.all([
            ...Object.values(settings.images).map(({ small }) => {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.src = small;
                    img.onload = resolve;
                });
            }),

            ...(gameSettings.enableGameScreen
                ? Object.values(settings.images).map(({ large }) => {
                      if (!large) {
                          return Promise.resolve(undefined);
                      }
                      return new Promise((resolve) => {
                          const img = new Image();
                          img.src = large;
                          img.onload = resolve;
                      });
                  })
                : []),
        ]);
    },
}));
