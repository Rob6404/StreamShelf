import { Rail as RailModel } from "@/types/Rail.model";
import { Title } from "@/types/Title";
import { useRouter } from "expo-router";
import { FlatList, StyleSheet, Text, View } from "react-native";
import FocusablePoster from "./FocusablePoster";

export default function Rail({rail, railIndex}: {rail: RailModel; railIndex: number}) {
    const router = useRouter();

    const renderItem = ({item, index}: {item: Title; index: number}) => (
        <FocusablePoster
            uri={item.logo}
            accessibilityLabel={item.description}
            // The first poster of the first rail gets focus when Home loads.
            hasTVPreferredFocus={railIndex === 0 && index === 0}
            onPress={() => router.push(`/details/${item.id}`)}
        />
    );

    return (
        <View style={styles.rail}>
            <Text>{rail.title}</Text>
            <FlatList horizontal={true}
                data={rail.titles}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem} />
        </View>
    );
}

const styles = StyleSheet.create({
    rail: {
        marginBottom: 12,
    },
});
