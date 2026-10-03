import { PlayerState, useVideoProgress } from "@/domain/player/useVideoProgress";
import { VideoPlayer, VideoView } from "expo-video";
import { ActivityIndicator, Button, Text, View } from "react-native";

export default function VideoPlayerScreen({ id, link }: { id: number, link: string}) {
        const { player, playerState, retryPlay } = useVideoProgress({ videoUrl: link, videoId: id });

        if (playerState === PlayerState.Loading) {
            return (
                <View>
                    <ActivityIndicator size="large" />
                </View>
            );
        } else if (playerState === PlayerState.Retry) {
                return (
                <View>
                    <Button title="Retry?" onPress={ retryPlay } />
                </View>
                );
        } else if (playerState === PlayerState.Error) {
                return (
                    <View>
                        <Text>BROKEN</Text>
                    </View>
                );
        }
        return (
                <VideoView 
                    player={player}
                    fullscreenOptions={{ enable: true }}/>
        );
}