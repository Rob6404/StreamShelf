import { useHomeScreen } from "@/domain/catalog/useHomeScreen";
import { Button, View } from "react-native";
import AsyncStateView from "../components/AsyncStateView";
import Rail from "../components/Rail";
import { useRouter } from "expo-router";

export default function HomeScreen() {
    const router = useRouter();
    const { homeScreen, viewState, reload } = useHomeScreen();

    return (
        <AsyncStateView viewState={viewState}
            onRetry={reload}
            loadedChildren={
                <View>
                    {homeScreen.map((rail, index) => (
                        <Rail key={rail.id} rail={rail} railIndex={index} />
                    ))}
                    <Button onPress={() => router.push("/my-list")} title="My List" />
                </View>
            }
        />
    );
}
