import { Rail as RailModel } from "@/types/Rail.model";
import { Title } from "@/types/Title";
import { Link } from "expo-router";
import { FlatList, Image, Pressable, Text, View } from "react-native";

export default function Rail({rail}: {rail: RailModel}) {

    const renderItem = ({item}: {item: Title}) => {
        return (
            <Link
                href= {{
                    pathname: "/details/[id]",
                    params: { id: item.id }
                }}
                asChild>
                <Pressable
                    focusable={true}
                    // onPress={setFocusedId(item.id)}
                >
                    <Image
                        source={{ uri: item.logo }}
                        style={{ height: 100, width: 100 }} />
                </Pressable>
            </Link>
        )
    };

    return (
        <View>
            <Text>{ rail.title }</Text>
            <FlatList horizontal={true}
                data={rail.titles}
                showsHorizontalScrollIndicator={false}
                keyExtractor={ (item) => item.id.toString()}
                renderItem={renderItem} />
        </View>
    );
}