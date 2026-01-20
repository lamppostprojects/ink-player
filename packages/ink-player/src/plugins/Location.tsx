import { createPlugin } from "@lamppost/ink-player";

export default createPlugin(() => ({
    type: "location",
    header({ context, currentState, transitionStatus }) {
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
    },
    key({ currentState }) {
        return currentState.tags.Location || null;
    },
}));
