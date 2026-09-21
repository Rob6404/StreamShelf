import { Button, Image, Text, View } from "react-native";
import AsyncStateView from "../components/AsyncStateView";
import { useTitleDetails } from "@/domain/titleDetails/useTitleDetails";

export default function TitleDetailsScreen({id}: {id: number}) {
    const {titleDetails, viewState, isMyList, addToMyList, removeFromMyList} = useTitleDetails(id);
    return (
        // You cannot get to this state with null titleDetails
        <AsyncStateView viewState={viewState}
            loadedChildren={
                <View>
                    <Image
                    source={{ uri: titleDetails?.logo }}
                    style={{ height: 100, width: 100 }}
                    />
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
