import { useState } from "react";
import { Image, Pressable, StyleSheet } from "react-native";

type FocusablePosterProps = {
    uri: string;
    onPress: () => void;
    accessibilityLabel: string;
    size?: number;
    /** Focus this poster when it first appears (TV only; ignored on phones and web). */
    hasTVPreferredFocus?: boolean;
};

/**
 * A poster that can be reached with a TV remote (D-pad) or the keyboard on web.
 * Focus state lives here, so moving focus re-renders only the two posters involved,
 * not the whole rail or list.
 */
export default function FocusablePoster({
    uri,
    onPress,
    accessibilityLabel,
    size = 100,
    hasTVPreferredFocus = false,
}: FocusablePosterProps) {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <Pressable
            focusable={true}
            hasTVPreferredFocus={hasTVPreferredFocus}
            onPress={onPress}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel}
            style={[styles.container, isFocused && styles.focused]}
        >
            <Image
                source={{ uri }}
                style={[{ width: size, height: size }, isFocused && styles.imageFocused]}
            />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        overflow: "hidden",
        borderWidth: 2,
        borderColor: "transparent",
    },
    focused: {
        borderColor: "#007AFF",
    },
    imageFocused: {
        opacity: 0.9,
    },
});
