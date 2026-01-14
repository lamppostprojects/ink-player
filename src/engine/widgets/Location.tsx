import type {
    GameState,
    WidgetHeaderProps,
    WidgetRegistry,
} from "../shared/types";

const key = ({ currentState }: { currentState: GameState }) => {
    return currentState.tags.Location || null;
};

function Location({
    context,
    currentState,
    transitionStatus,
}: WidgetHeaderProps) {
    if (context === "history") {
        return null;
    }

    const location = currentState.tags.Location;

    if (!location) {
        return null;
    }

    const hasHeaderImage = currentState.tags.Image;

    return (
        <h1
            style={
                hasHeaderImage
                    ? {
                          position: "absolute",
                          bottom: 0,
                          left: "var(--bs-card-spacer-x)",
                          marginBottom: 0,
                      }
                    : {
                          marginLeft: "var(--bs-card-spacer-x)",
                          paddingLeft: 0,
                          paddingTop: "0.5rem",
                          display: "inline-block",
                      }
            }
            className={`fs-3 rounded-top transitioned ${transitionStatus || ""} ${hasHeaderImage ? "p-2" : ""}`}
        >
            {location}
        </h1>
    );
}

export const locationWidget = {
    type: "location",
    header: Location,
    key,
} satisfies WidgetRegistry;
