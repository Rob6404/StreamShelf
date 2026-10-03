import { Button, StyleSheet, Text, View } from "react-native";
import AsyncStateView from "../components/AsyncStateView";
import FocusablePoster from "../components/FocusablePoster";
import { useTitleDetails } from "@/domain/titleDetails/useTitleDetails";
import { useRouter } from "expo-router";

export default function TitleDetailsScreen({id}: {id: number}) {
    const router = useRouter();
    const {titleDetails, viewState, isMyList, addToMyList, removeFromMyList, reload} = useTitleDetails(id);

    const playVideo = () => {
        if (!titleDetails) return;
        router.push({ pathname: "/video-player", params: { id: String(id), url: titleDetails.videoUrl } });
    };

    return (
        // Loaded always has titleDetails; the ?. is only for TypeScript.
        <AsyncStateView viewState={viewState}
            onRetry={reload}
            loadedChildren={
                <View style={styles.container}>
                    <FocusablePoster
                        uri={titleDetails?.logo ?? ""}
                        accessibilityLabel={`Play ${titleDetails?.description ?? "video"}`}
                        hasTVPreferredFocus={true}
                        onPress={playVideo}
                    />
                    <Text>{titleDetails?.description}</Text>
                    <Text>{titleDetails ? new Date(titleDetails.metaData.createdAt).toLocaleDateString() : ""}</Text>
                    <Button onPress={isMyList ? removeFromMyList : addToMyList} title={isMyList ? "Remove from My List" : "Add to My List"} />
                </View>
            }
        />
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        gap: 8,
        alignItems: "flex-start",
    },
});
