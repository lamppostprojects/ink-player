import CheckCircleFillIcon from "bootstrap-icons/icons/check-circle-fill.svg?react";
import LockFillIcon from "bootstrap-icons/icons/lock-fill.svg?react";
import { useCallback, useState } from "preact/hooks";
import Card from "react-bootstrap/Card";
import Stack from "react-bootstrap/Stack";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { createPlugin } from "../shared/plugins";

const NUM_COLUMNS = 2;

interface AchievementsSettings {
    achievements: Record<
        string,
        {
            icon: string;
            title: string;
            description: string;
            hidden?: boolean;
            showHiddenButtonText?: string;
        }
    >;
}

export default createPlugin((settings: AchievementsSettings, gameSettings) => {
    const useAchievementStore = create<{
        achievements: string[];
        addAchievement: (achievement: string) => void;
    }>()(
        persist(
            (set, get) => ({
                achievements: [],
                addAchievement: (achievement: string) =>
                    set({
                        achievements: [...get().achievements, achievement],
                    }),
            }),
            {
                name: `${gameSettings.gameName}-achievements`,
            },
        ),
    );

    function Achievement({
        icon,
        title,
        description,
        completed,
        hidden,
        showHiddenButtonText,
    }: {
        icon: string;
        title: string;
        description: string;
        completed: boolean;
        hidden: boolean;
        showHiddenButtonText?: string;
    }) {
        const [showSpoiler, setShowSpoiler] = useState(false);

        const handleClick = useCallback(() => {
            setShowSpoiler(true);
        }, []);

        const Icon = icon as React.ElementType;

        return (
            <div className="card mb-3 position-relative">
                {showHiddenButtonText &&
                    !completed &&
                    hidden &&
                    !showSpoiler && (
                        <button
                            type="button"
                            className="btn btn-sm btn-primary position-absolute top-50 start-50 translate-middle z-1 btn-secondary"
                            onClick={handleClick}
                        >
                            {showHiddenButtonText}
                        </button>
                    )}
                <div
                    className={`row g-0 ${completed ? "achievement-completed" : "achievement-incomplete"} ${hidden && !showSpoiler && !completed ? "achievement-blurred" : ""}`}
                >
                    <div className="col-md-4">
                        {typeof icon === "string" ? (
                            <img
                                src={icon}
                                className="img-fluid rounded-start"
                                alt={title}
                            />
                        ) : (
                            <div
                                style={{
                                    width: "100%",
                                    height: "100%",
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
                                        height: "100%",
                                        objectFit: "contain",
                                    }}
                                />
                            </div>
                        )}
                    </div>
                    <div className="col-md-8">
                        <div className="card-body">
                            <h5
                                className={`card-title ${completed ? "" : "text-muted"}`}
                            >
                                {completed && (
                                    <CheckCircleFillIcon className="bi bi-check-circle-fill align-baseline text-success" />
                                )}
                                {!completed && (
                                    <LockFillIcon className="bi bi-lock-fill align-baseline" />
                                )}{" "}
                                {title}
                            </h5>
                            <p className="card-text text-muted text-body-secondary small">
                                {description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return {
        type: "achievements",
        screen() {
            const playerAchievements = useAchievementStore(
                (state) => state.achievements,
            );

            const achievements = Object.keys(settings.achievements).map(
                (id) => {
                    const achievement = settings.achievements[id];
                    return (
                        <Achievement
                            key={id}
                            icon={achievement.icon}
                            title={achievement.title}
                            description={achievement.description}
                            completed={playerAchievements.includes(id)}
                            hidden={achievement.hidden ?? false}
                            showHiddenButtonText={
                                achievement.showHiddenButtonText
                            }
                        />
                    );
                },
            );

            const numRows = Math.ceil(achievements.length / NUM_COLUMNS);

            const rows = Array.from({ length: numRows }, (_, index) => {
                const start = index * NUM_COLUMNS;
                const end = start + NUM_COLUMNS;
                return (
                    <div className="row">
                        {achievements.slice(start, end).map((achievement) => (
                            <div className={`col-md-${12 / NUM_COLUMNS}`}>
                                {achievement}
                            </div>
                        ))}
                    </div>
                );
            });

            return (
                <Card className="mb-3">
                    <Card.Body>
                        <Stack direction="horizontal" gap={3}>
                            <h1>Achievements</h1>
                        </Stack>
                        <hr />
                        {rows}
                    </Card.Body>
                </Card>
            );
        },
        knot({ currentState }) {
            const addAchievement = useAchievementStore(
                (state) => state.addAchievement,
            );
            const id = currentState.tags
                .Achievement as keyof typeof settings.achievements;
            const achievement = settings.achievements?.[id];

            if (achievement) {
                addAchievement(id);
            }

            return null;
        },
        toast(currentState) {
            const playerAchievements = useAchievementStore(
                (state) => state.achievements,
            );
            const id = currentState.tags
                .Achievement as keyof typeof settings.achievements;
            const achievement = settings.achievements?.[id];

            if (!achievement || playerAchievements.includes(id)) {
                return [];
            }

            return [
                {
                    id,
                    icon: achievement.icon,
                    page: "achievements",
                    title: `Achievement Unlocked!`,
                    description: (
                        <Achievement
                            key={id}
                            icon={achievement.icon}
                            title={achievement.title}
                            description={achievement.description}
                            completed={true}
                            hidden={false}
                        />
                    ),
                },
            ];
        },
        async preload() {
            return Promise.all(
                Object.values(settings.achievements).map((achievement) => {
                    return new Promise((resolve) => {
                        if (typeof achievement.icon === "string") {
                            const achievementImg = new Image();
                            achievementImg.src = achievement.icon;
                            achievementImg.onload = () => resolve(undefined);
                        } else {
                            resolve(undefined);
                        }
                    });
                }),
            );
        },
    };
});
