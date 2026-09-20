import { useMyList } from "@/domain/myList/useMyList";
import AsyncStateView from "../components/AsyncStateView";
import { Image, View } from "react-native";

export default function MyListScreen() {
    const { myList, viewState } = useMyList();

    return (
        <AsyncStateView viewState={viewState}
            loadedChildren={
                <View>
                    {myList?.map(title => (
                        <View>
                            <Image
                            source={{ uri: title.logo }}
                            style={{ height: 100, width: 100 }}
                            />
                            <br />
                        </View>
                    ))}
                </View>
            }
        />
    );
}