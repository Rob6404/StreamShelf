import { useLocalSearchParams } from "expo-router";
import TitleDetailsScreen from "@/presentation/screens/TitleDetailsScreen";

export default function TitleDetailsRoute() {
    const { id } = useLocalSearchParams<{id: string}>();
    const titleId = Number(id);
    return <TitleDetailsScreen id={titleId} />
}

