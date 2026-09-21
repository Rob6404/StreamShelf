import { useHomeScreen } from "@/domain/catalog/useCatalog";
import { Pressable, Text, View } from "react-native";
import AsyncStateView from "../components/AsyncStateView";
import Rail from "../components/Rail";
import { Link, useRouter } from "expo-router";
import { Button } from "expo-router/build/react-navigation";

export default function HomeScreen() {
    const router = useRouter();
    const { homeScreen, viewState } = useHomeScreen();

    return (
        <AsyncStateView viewState={viewState}
            loadedChildren={
                <View>
                    {homeScreen?.map(rail => (
                        <View key={rail.id}>
                            <Rail key={rail.id} rail={rail} />
                        </View>
                    ))}
                    <Button onPress={() => router.push("/my-list")}>Go to My List!</Button>
                </View>
            }
        />
    );
}