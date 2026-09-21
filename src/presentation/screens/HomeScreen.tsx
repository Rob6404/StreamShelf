import { useHomeScreen } from "@/domain/catalog/useCatalog";
import { Button, View } from "react-native";
import AsyncStateView from "../components/AsyncStateView";
import Rail from "../components/Rail";
import { useRouter } from "expo-router";

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
                    <Button onPress={() => router.push("/my-list")} title="Go to My List!" />
                </View>
            }
        />
    );
}