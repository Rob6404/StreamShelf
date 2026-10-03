import { watchProgressRepository } from "@/data/player/WatchProgressRepository";
import { useEventListener } from "expo";
import { useVideoPlayer } from "expo-video";
import { useEffect, useRef, useState } from "react";

export interface UseVideoProgressProps {
    videoUrl: string;
    videoId: number;
}

export enum PlayerState {
    Loading,
    Error,
    Retry,
    Success
}

/** Within this many seconds of the end, a video counts as finished and its progress is cleared. */
const VIDEO_COMPLETED_THRESHOLD_SECONDS = 5;
/** Save progress at most this often while playing. */
const SAVE_INTERVAL_SECONDS = 3;
/** If a retry isn't ready to play within this time, give up and show the error. */
const RETRY_TIMEOUT_MS = 5000;

export const useVideoProgress = ({ videoUrl, videoId }: UseVideoProgressProps) => {
    const [playerState, setPlayerState] = useState<PlayerState>(PlayerState.Loading);
    const [initialTime, setInitialTime] = useState<number | null>(null);

    const lastSavedTimeRef = useRef<number>(0);
    const hasSeekedOnLoad = useRef<boolean>(false);
    const justSeeked = useRef<boolean>(false);
    const retryCount = useRef<number>(0);
    const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    const player = useVideoPlayer(videoUrl, (p) => {
        p.timeUpdateEventInterval = SAVE_INTERVAL_SECONDS;
    });

    // Load the saved resume position for this video.
    useEffect(() => {
        let cancelled = false;

        (async () => {
            const savedProgress = await watchProgressRepository.getProgress(videoId);
            if (cancelled) return;
            setInitialTime(savedProgress);
            setPlayerState(PlayerState.Success);
        })();

        return () => { cancelled = true; };
    }, [videoId]);

    // Never leave a pending retry timer running after the screen unmounts.
    useEffect(() => {
        return () => clearTimeout(retryTimeoutRef.current);
    }, []);

    const retryPlay = async () => {
        hasSeekedOnLoad.current = false;
        setPlayerState(PlayerState.Loading);

        // If the player doesn't become ready in time, give up. Reaching "readyToPlay"
        // clears this timer, so the callback doesn't need to read (possibly stale) state.
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = setTimeout(() => {
            retryCount.current += 1;
            setPlayerState(PlayerState.Error);
        }, RETRY_TIMEOUT_MS);

        try {
            await player.replaceAsync(videoUrl);
        } catch (error) {
            console.error("useVideoProgress: couldn't retry content", error);
        }
    };

    useEventListener(player, "statusChange", (event) => {
        const status = event.status.toLowerCase();

        if (status === "error") {
            clearTimeout(retryTimeoutRef.current);
            // Offer one retry, then show the error.
            setPlayerState(retryCount.current > 0 ? PlayerState.Error : PlayerState.Retry);
            retryCount.current += 1;
            return;
        }

        if (status === "readytoplay" && initialTime !== null && !hasSeekedOnLoad.current) {
            clearTimeout(retryTimeoutRef.current);
            hasSeekedOnLoad.current = true;
            if (initialTime > 0) {
                // Resume where the viewer left off.
                player.seekBy(initialTime - player.currentTime);
                justSeeked.current = true;
            }
            setPlayerState(PlayerState.Success);
        }
    });

    useEventListener(player, "timeUpdate", async (event) => {
        // The first update after a seek reports the seek itself; don't save it.
        if (justSeeked.current) {
            justSeeked.current = false;
            return;
        }

        const currentTime = event.currentTime;

        if (player.duration && currentTime > player.duration - VIDEO_COMPLETED_THRESHOLD_SECONDS) {
            await watchProgressRepository.removeProgress(videoId);
            return;
        }

        if (Math.abs(currentTime - lastSavedTimeRef.current) >= SAVE_INTERVAL_SECONDS) {
            lastSavedTimeRef.current = currentTime;
            await watchProgressRepository.saveProgress(videoId, currentTime);
        }
    });

    return { player, playerState, retryPlay };
};
