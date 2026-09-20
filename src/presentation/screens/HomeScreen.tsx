import { useHomeScreen } from "@/domain/catalog/useCatalog";
import { Text } from "react-native";
import AsyncStateView from "../components/AsyncStateView";

export default function HomeScreen() {
    const { homeScreen, viewState } = useHomeScreen();
    

    return (
        <AsyncStateView viewState={ viewState }
            loadedChildren={ <Text>We need to inject the rails here from the homescreen data </Text> }
        />
    );
}