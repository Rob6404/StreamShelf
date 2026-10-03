import { useMyList } from "@/domain/myList/MyListContext";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import AsyncStateView from "../components/AsyncStateView";
import FocusablePoster from "../components/FocusablePoster";

export default function MyListScreen() {
    const { myList, viewState } = useMyList();
    const router = useRouter();

    return (
        <AsyncStateView viewState={viewState}
            emptyChildren={
                <View style={styles.message}>
                    <Text>Your list is empty. Add titles from their details page.</Text>
                </View>
            }
            loadedChildren={
                <View>
                    {myList.map((title, index) => (
                        <FocusablePoster
                            key={title.id}
                            uri={title.logo}
                            accessibilityLabel={`Open title ${title.id}`}
                            hasTVPreferredFocus={index === 0}
                            onPress={() => router.push(`/details/${title.id}`)}
                        />
                    ))}
                </View>
            }
        />
    );
}

const styles = StyleSheet.create({
    message: {
        padding: 24,
    },
});
