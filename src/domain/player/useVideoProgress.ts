import { WatchProgressRepository } from "@/data/player/WatchProgressRepository";
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

export const useVideoProgress = ({videoUrl, videoId}: UseVideoProgressProps) => {
    const VIDEO_COMPLETED_THRESHOLD = 5;
    const [ playerState, setPlayerState ] = useState<PlayerState>(PlayerState.Loading);
    const [ initialTime, setInitialTime ] = useState<number | null>(null);

    const lastSavedTimeRef = useRef<number>(0);
    const hasSeekedOnLoad = useRef<boolean>(false);
    const justSeeked = useRef<boolean>(false);
    const retryCount = useRef<number>(0);
    const retryTimeoutRef = useRef<number>(0);

    function startRetryTimer() {
        retryTimeoutRef.current = setTimeout(() => {
            if (playerState !== PlayerState.Success) {
                retryCount.current += 1;
                setPlayerState(PlayerState.Error);
            }
        }, 5000);
    };
    
    useEffect(() => {
        const fetchSavedProgress = async () => {
            try {
                const savedProgress = await WatchProgressRepository.getProgress(videoId.toString());
                setInitialTime(savedProgress ? savedProgress : 0);
            } catch (error) {
                console.error("failed to load start time", error);
                setInitialTime(0);
            } finally {
                setPlayerState(PlayerState.Success);
            }
        };
        fetchSavedProgress();
    }, [videoId]);

    
    const retryPlay = async () => {
        try {
            await player.replaceAsync(videoUrl);
        } catch (error) {
            console.error(`couldn't retry contenct: ${error}`);
        }
        startRetryTimer();
        hasSeekedOnLoad.current = false;
        setPlayerState(PlayerState.Loading);
    };

    const player = useVideoPlayer(videoUrl, (player) => {
        player.timeUpdateEventInterval = 3.0;
    });

    useEventListener(player, 'statusChange', (event) => {
        if (event.status.toLowerCase() === "error") {
            if (retryCount.current > 0) {
                setPlayerState(PlayerState.Error);
            } else {
                setPlayerState(PlayerState.Retry);
            }
            
            retryCount.current += 1;
        }
        if (event.status.toLowerCase() === "readytoplay" && 
            initialTime !== null && !hasSeekedOnLoad.current) {
                clearTimeout(retryTimeoutRef.current);
                hasSeekedOnLoad.current = true;
                if (initialTime > 0) {
                    player.currentTime = initialTime;
                    justSeeked.current = true;
                }
                setPlayerState(PlayerState.Success);
            }
    });

    useEventListener(player, 'timeUpdate', async (event) => {
        if (justSeeked.current) {
            justSeeked.current = false;
            return;
        }

        try {
            const currentTime = event.currentTime;

            if (player.duration && currentTime > player.duration - VIDEO_COMPLETED_THRESHOLD) {
                await WatchProgressRepository.removeProgress(videoId.toString());
                return;
            } 
            
            if (Math.abs(currentTime - lastSavedTimeRef.current) >= 3) {
                lastSavedTimeRef.current = currentTime;
                await WatchProgressRepository.saveProgress(videoId, currentTime);
            }
        } catch (error) {
                console.error("couldn't update time", error);
        }
    });

    return { player, playerState, retryPlay };
};