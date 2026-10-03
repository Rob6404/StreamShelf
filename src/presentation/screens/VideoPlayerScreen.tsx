import { PlayerState, useVideoProgress } from "@/domain/player/useVideoProgress";
import { VideoView } from "expo-video";
import { ActivityIndicator, Button, StyleSheet, Text, View } from "react-native";

export default function VideoPlayerScreen({ id, link }: { id: number, link: string }) {
    const { player, playerState, retryPlay } = useVideoProgress({ videoUrl: link, videoId: id });

    switch (playerState) {
        case PlayerState.Loading:
            return (
                <View style={styles.center}>
                    <ActivityIndicator size="large" />
                </View>
            );
        case PlayerState.Retry:
            return (
                <View style={styles.center}>
                    <Text>The video couldn&apos;t start.</Text>
                    <Button title="Try again" onPress={retryPlay} hasTVPreferredFocus={true} />
                </View>
            );
        case PlayerState.Error:
            return (
                <View style={styles.center}>
                    <Text>This video can&apos;t be played right now.</Text>
                </View>
            );
        case PlayerState.Success:
            return (
                <VideoView
                    style={styles.video}
                    player={player}
                    fullscreenOptions={{ enable: true }} />
            );
    }
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
    },
    video: {
        flex: 1,
    },
});
