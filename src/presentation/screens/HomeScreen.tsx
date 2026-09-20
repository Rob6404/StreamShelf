import { useHomeScreen } from "@/domain/catalog/useCatalog";
import { Text, View } from "react-native";
import AsyncStateView from "../components/AsyncStateView";
import Rail from "../components/Rail";
import { Link } from "expo-router";

export default function HomeScreen() {
    const { homeScreen, viewState } = useHomeScreen();

    return (
        <AsyncStateView viewState={viewState}
            loadedChildren={
                <View>
                    {homeScreen?.map(rail => (
                        <View>
                            <Rail key={rail.id} rail={rail} />
                            <br />
                        </View>
                    ))}
                    <br />
                    <Link href="/my-list">Go to My List!</Link>
                </View>
            }
        />
    );
}