import { useEffect, useMemo, useState } from "preact/hooks";
import BootstrapImage from "react-bootstrap/Image";

import { createPlugin } from "../shared/plugins";

const DEFAULT_DURATION = 1500;

const getAlt = (input: Record<string, string>) => {
    return (
        input.alt ||
        `A ${input.die} die showing a ${input.value} on the top face.`
    );
};

interface DiceRollSettings {
    images: Record<string, Record<string, string>>;
}

export default createPlugin<DiceRollSettings>(({ settings }) => {
    return {
        type: "dice-roll",
        text({ input, context }) {
            const die = input.die as string;
            const value = input.value as string;
            const duration = input.duration
                ? parseFloat(input.duration as string)
                : DEFAULT_DURATION;
            const alt = input.alt as string;
            const diceSrc = settings.images?.[die]?.[value] as string;
            const [isFinishedAnimating, setIsFinishedAnimating] = useState(
                duration === 0,
            );
            const key = useMemo(() => Date.now(), []);

            useEffect(() => {
                if (duration === 0) {
                    return;
                }
                const timer = setTimeout(() => {
                    setIsFinishedAnimating(true);
                }, duration);
                return () => clearTimeout(timer);
            }, [duration]);

            if (!diceSrc) {
                return alt ? <p>{alt}</p> : null;
            }

            if (context === "history") {
                return (
                    <p>
                        [<strong>Dice Roll:</strong> {getAlt(input)}]
                    </p>
                );
            }

            return (
                <p>
                    <BootstrapImage
                        fluid
                        src={`${diceSrc}?${key}`}
                        alt={getAlt({ die, value, alt })}
                        className={`dice-roll ${isFinishedAnimating ? "finished" : ""}`}
                    />
                </p>
            );
        },
        log(props) {
            if (!("input" in props)) {
                return "";
            }
            return `<p>[<strong>Dice Roll:</strong> ${getAlt(props.input)}]</p>`;
        },
        async preload() {
            return Promise.all(
                Object.values(settings.images).flatMap((diceSize) => {
                    return Object.values(diceSize).map((face) => {
                        return new Promise((resolve) => {
                            const faceImg = new Image();
                            faceImg.src = face as string;
                            faceImg.onload = resolve;
                        });
                    });
                }),
            );
        },
    };
});
