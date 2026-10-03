import { Button, Image, Pressable, StyleSheet, Text, View } from "react-native";
import AsyncStateView from "../components/AsyncStateView";
import { useTitleDetails } from "@/domain/titleDetails/useTitleDetails";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function TitleDetailsScreen({id}: {id: number}) {
    const router = useRouter();
    const {titleDetails, viewState, isMyList, addToMyList, removeFromMyList} = useTitleDetails(id);
    const [focusedId, setFocusedId] = useState(0);
    const handlePress = () => {
        router.push(`/video-player?id=${id}`);
    };

    const isFocused = focusedId === id;

    return (
        // You cannot get to this state with null titleDetails
        <AsyncStateView viewState={viewState}
            loadedChildren={
                <View>
                    <Pressable
                        focusable={true}
                        hasTVPreferredFocus={true}
                        onPress={handlePress}
                        onFocus={() => setFocusedId(id)}
                        onBlur={() => setFocusedId(0)}
                        style={() => [
                                    styles.imageContainer,
                                    isFocused && styles.focusedStyle
                        ]}>
                        <Image
                        source={{ uri: titleDetails?.logo }}
                        style={{ height: 100, width: 100 }}
                        />
                        
                    </Pressable>
                    <Text>{titleDetails?.description}</Text>
                    <Text>{String(titleDetails?.metaData.createdAt)}</Text>
                    {//TODO: make a focusable a component
                    }
                    <Button onPress={isMyList ? removeFromMyList : addToMyList} title={isMyList ? "Remove" : "Add"} />
                </View>
            }
        />
    );
}

const styles = StyleSheet.create({
  imageContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  image: {
    width: 100,
    height: 100,
  },
  focusedStyle: {
    borderColor: '#007AFF'
  },
  imageFocused: {
    opacity: 0.9,
  }
});
