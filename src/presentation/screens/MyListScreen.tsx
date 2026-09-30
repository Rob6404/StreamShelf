import { useMyList } from "@/domain/myList/MyListContext";
import AsyncStateView from "../components/AsyncStateView";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function MyListScreen() {
    const myListContext = useMyList();
    const [focusedId, setFocusedId] = useState(0);
    const router = useRouter();

    const handlePress = (id: number) => {
        router.push(`/details/${id}`);
    };

    return (
        <AsyncStateView viewState={myListContext.viewState}
            loadedChildren={
                <View>
                    {myListContext.myList?.map(title => (
                        <View key={title.id}>
                            <Pressable
                                focusable={true}
                                onPress={() => handlePress(title.id)}
                                onFocus={() => setFocusedId(title.id)}
                                onBlur={() => setFocusedId(0)}
                                style={() => [
                                            styles.imageContainer,
                                            title.id == focusedId && styles.focusedStyle
                                ]}>
                                <Image
                                source={{ uri: title.logo }}
                                style={{ height: 100, width: 100 }}
                                />
                            </Pressable>
                        </View>
                    ))}
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
