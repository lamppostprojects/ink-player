import Card from "react-bootstrap/Card";

import type {
    GameState,
    WidgetHeaderProps,
    WidgetRegistry,
} from "../shared/types";
import { getWidgetSettings } from "../shared/widgets";

function key({ currentState }: { currentState: GameState }) {
    return currentState.tags.Image || null;
}

function HeaderImage({
    context,
    currentState,
    transitionStatus,
}: WidgetHeaderProps) {
    if (context === "history") {
        return null;
    }
    const headerImages = getWidgetSettings("headerImage");
    const imageSrc =
        headerImages?.[currentState.tags.Image as keyof typeof headerImages];
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
}

const preload = async () => {
    const headerImages = getWidgetSettings("headerImage");

    if (!headerImages) {
        return;
    }

    return Promise.all(
        Object.values(headerImages).map((headerImage) => {
            return new Promise((resolve) => {
                const headerImg = new Image();
                headerImg.src = headerImage;
                headerImg.onload = resolve;
            });
        }),
    );
};

export const headerImageWidget = {
    type: "header-image",
    header: HeaderImage,
    preload,
    key,
} satisfies WidgetRegistry;
