import { Rail as RailModel } from "@/types/Rail.model";
import { Title } from "@/types/Title";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function Rail({rail}: {rail: RailModel}) {
    const router = useRouter();
    const [focusedId, setFocusedId] = useState(0);


    const renderItem = ({item}: {item: Title}) => {
        const handlePress = () => {
            router.push(`/details/${item.id}`);
        };

        const isFocused = item.id == focusedId;

        return (
                <Pressable
                    focusable={true}
                    onPress={handlePress}
                    onFocus={() => setFocusedId(item.id)}
                    onBlur={() => setFocusedId(0)}
                    style={() => [
                                styles.imageContainer,
                                isFocused && styles.focusedStyle
                     ]}
                >
                    <Image
                        source={{ uri: item.logo }}
                        style={[ styles.image, isFocused && styles.imageFocused ]} />
                </Pressable>
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

const styles = StyleSheet.create({
  imageContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  image: {
    width: 100,
    height: 100,
  },
  focusedStyle: {
    borderColor: '#007AFF'
  },
  imageFocused: {
    opacity: 0.9,
  }
});
