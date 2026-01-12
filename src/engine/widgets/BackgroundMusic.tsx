import MuteIcon from "bootstrap-icons/icons/volume-mute.svg?react";
import VolumeIcon from "bootstrap-icons/icons/volume-up.svg?react";
import { memoize } from "es-toolkit";
import { useCallback, useEffect, useState } from "preact/hooks";
import Button from "react-bootstrap/esm/Button";
import OverlayTrigger from "react-bootstrap/esm/OverlayTrigger";
import Stack from "react-bootstrap/esm/Stack";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Popover from "react-bootstrap/Popover";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { getSettings } from "../shared/settings";
import type {
    GameState,
    WidgetHeaderProps,
    WidgetRegistry,
} from "../shared/types";
import { getWidgetSettings } from "../shared/widgets";

function key({ currentState }: { currentState: GameState }) {
    return currentState.tags.BackgroundMusic || null;
}

const FADE_DURATION = 1000;
const FADE_STEPS = 100;

const isAudioElementPlayable = async (audioElement: HTMLAudioElement) => {
    // biome-ignore lint/suspicious/noAsyncPromiseExecutor: we want to use async here
    return new Promise(async (resolve) => {
        while (true) {
            try {
                await audioElement.play();
                resolve(true);
            } catch (_error) {
                resolve(false);
            }
            await new Promise((resolve) => setTimeout(resolve, 100));
        }
    });
};

const getUseAudioStore = memoize(() =>
    create<{
        audioElements: Map<string, HTMLAudioElement>;
        activeAudioElements: Set<HTMLAudioElement>;
        volume: number;
        setVolume: (volume: number) => void;
        getAudioElement: (src: string) => HTMLAudioElement;
        play: (src: string) => Promise<void>;
        stop: (src: string) => void;
    }>()(
        persist(
            (set, get) => ({
                audioElements: new Map(),
                activeAudioElements: new Set(),
                volume: 1,
                setVolume: (volume: number) => {
                    set({ volume });
                    const { activeAudioElements } = get();
                    for (const audioElement of activeAudioElements) {
                        audioElement.volume = volume;
                    }
                },
                getAudioElement: (src: string) => {
                    const { audioElements } = get();
                    const existingAudioElement = audioElements.get(src);
                    if (existingAudioElement) {
                        return existingAudioElement;
                    }
                    const audioElement = new Audio();
                    audioElement.src = src;
                    audioElement.autoplay = true;
                    audioElement.loop = true;
                    audioElement.volume = 0;
                    audioElements.set(src, audioElement);
                    return audioElement;
                },
                play: async (src: string) => {
                    const {
                        volume: maxVolume,
                        getAudioElement,
                        activeAudioElements,
                    } = get();

                    const audioElement = getAudioElement(src);
                    activeAudioElements.add(audioElement);
                    set({ activeAudioElements });

                    // From: https://stackoverflow.com/a/68806539
                    let i = 0;
                    const interval = FADE_DURATION / FADE_STEPS;
                    await isAudioElementPlayable(audioElement);
                    audioElement.currentTime = 0;
                    const intervalId = setInterval(() => {
                        const volume = (maxVolume / FADE_STEPS) * i;
                        audioElement.volume = volume;
                        if (++i >= FADE_STEPS) {
                            clearInterval(intervalId);
                            audioElement.volume = maxVolume;
                        }
                    }, interval);
                },
                stop: (src: string) => {
                    const { getAudioElement, activeAudioElements } = get();

                    const audioElement = getAudioElement(src);
                    activeAudioElements.delete(audioElement);
                    set({ activeAudioElements });

                    let i = 0;
                    const interval = FADE_DURATION / FADE_STEPS;
                    const startVolume = audioElement.volume;
                    const intervalId = setInterval(() => {
                        const volume =
                            startVolume - (startVolume / FADE_STEPS) * i;
                        audioElement.volume = volume;
                        if (++i >= FADE_STEPS) {
                            clearInterval(intervalId);
                            audioElement.volume = 0;
                        }
                    }, interval);
                },
            }),
            {
                name: `${getSettings().gameName}-audio`,
                partialize: (state) => ({
                    volume: state.volume,
                }),
            },
        ),
    ),
);

function BackgroundMusic({
    context,
    currentState,
    transitionStatus,
}: WidgetHeaderProps) {
    if (context === "history") {
        return null;
    }

    const backgroundMusic = getWidgetSettings("backgroundMusic");
    const audioSrc =
        backgroundMusic?.[
            currentState.tags.BackgroundMusic as keyof typeof backgroundMusic
        ];

    if (!audioSrc) {
        return null;
    }

    const useAudioStore = getUseAudioStore();
    const play = useAudioStore((state) => state.play);
    const stop = useAudioStore((state) => state.stop);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (transitionStatus === "entering" || transitionStatus === "entered") {
            if (isPlaying) {
                return;
            }
            setIsPlaying(true);
            play(audioSrc);
        } else if (transitionStatus === "exiting") {
            stop(audioSrc);
        }
    }, [transitionStatus, isPlaying]);

    return null;
}

function BackgroundMusicNav() {
    const useAudioStore = getUseAudioStore();
    const volume = useAudioStore((state) => state.volume);
    const setVolume = useAudioStore((state) => state.setVolume);
    const backgroundMusic = getWidgetSettings("backgroundMusic");

    if (!backgroundMusic) {
        return null;
    }

    const [open, setOpen] = useState(false);

    const handleToggle = useCallback(() => {
        setVolume(volume > 0 ? 0 : 1);
        setOpen(false);
    }, [setVolume, volume]);

    const handleVolumeChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setVolume(Number(e.currentTarget?.value ?? "1"));
        },
        [setVolume],
    );

    const icon = (
        <>
            {volume === 0 ? (
                <MuteIcon
                    className="bi"
                    style={{ width: "1.5em", height: "1.5em" }}
                />
            ) : (
                <VolumeIcon
                    className="bi"
                    style={{ width: "1.5em", height: "1.5em" }}
                />
            )}{" "}
            <span className="visually-hidden">
                {volume === 0 ? "Mute" : "Unmute"}
            </span>
        </>
    );

    const popover = (
        <Popover>
            <Popover.Body>
                <Stack direction="horizontal" gap={2}>
                    <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={handleToggle}
                    >
                        {icon}
                    </Button>
                    <Form.Range
                        value={volume}
                        min={0}
                        max={1}
                        step={0.01}
                        onChange={handleVolumeChange}
                    />
                </Stack>
            </Popover.Body>
        </Popover>
    );

    return (
        <OverlayTrigger
            trigger="click"
            placement="bottom"
            overlay={popover}
            flip={true}
            show={open}
        >
            {({ ...triggerHandler }) => (
                <Nav.Link {...triggerHandler} onClick={() => setOpen(!open)}>
                    {icon}
                </Nav.Link>
            )}
        </OverlayTrigger>
    );
}

const preload = async () => {
    const backgroundMusic = getWidgetSettings("backgroundMusic");

    if (!backgroundMusic) {
        return;
    }

    return Promise.all(
        Object.values(backgroundMusic).map((backgroundMusic) => {
            return new Promise((resolve) => {
                const audio = new Audio();
                audio.src = backgroundMusic;
                audio.oncanplaythrough = resolve;
            });
        }),
    );
};

export const backgroundMusicWidget = {
    type: "backgroundMusic",
    header: BackgroundMusic,
    nav: BackgroundMusicNav,
    preload,
    key,
} satisfies WidgetRegistry;
