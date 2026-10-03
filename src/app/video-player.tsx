import { useLocalSearchParams } from "expo-router";
import VideoPlayerScreen from "@/presentation/screens/VideoPlayerScreen";

export default function VideoPlayerRoute() {
    const { id } = useLocalSearchParams<{id: string}>();
    const videoId = Number(id);
    
    if (!videoId || !id) {
        return null;
    }

    return <VideoPlayerScreen id={videoId} link={"https://samplelib.com/mp4/sample-15s.mp4"} />
}

// 