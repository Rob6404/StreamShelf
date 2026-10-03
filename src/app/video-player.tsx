import { useLocalSearchParams } from "expo-router";
import VideoPlayerScreen from "@/presentation/screens/VideoPlayerScreen";

export default function VideoPlayerRoute() {
    const { id, url } = useLocalSearchParams<{ id: string; url: string }>();
    const videoId = Number(id);

    if (!videoId || !url) {
        return null;
    }

    return <VideoPlayerScreen id={videoId} link={url} />;
}
