import Card from "react-bootstrap/Card";

import { createPlugin } from "../shared/plugins";

interface HeaderImageSettings {
    images: Record<string, string>;
}

export default createPlugin<HeaderImageSettings>(({ settings }) => ({
    type: "header-image",
    header({ context, currentState, transitionStatus }) {
        if (context === "history") {
            return null;
        }
        const imageSrc =
            settings.images?.[
                currentState.tags.Image as keyof typeof settings.images
            ];
        if (!imageSrc) {
            return null;
        }
        return (
            <Card.Img
                src={imageSrc}
                alt={currentState.tags.Image}
                variant="top"
                className={`transitioned ${transitionStatus || ""}`}
            />
        );
    },
    async preload() {
        return Promise.all(
            Object.values(settings.images).map((headerImage) => {
                return new Promise((resolve) => {
                    const headerImg = new Image();
                    headerImg.src = headerImage;
                    headerImg.onload = resolve;
                });
            }),
        );
    },
    key({ currentState }) {
        return currentState.tags.Image || null;
    },
}));
