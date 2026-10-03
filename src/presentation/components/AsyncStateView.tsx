import { ViewState } from "@/types/ViewState";
import { ReactNode, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

type AsyncStateViewProps = {
    viewState: ViewState;
    loadedChildren: ReactNode;
    loadingChildren?: ReactNode;
    errorChildren?: ReactNode;
    emptyChildren?: ReactNode;
    /** When provided, the default error state shows a "Try again" button that calls it. */
    onRetry?: () => void;
};

/** Renders the right UI for each async state, so every screen handles them the same way. */
export default function AsyncStateView({ viewState, loadedChildren, loadingChildren, errorChildren, emptyChildren, onRetry }: AsyncStateViewProps) {
    switch (viewState) {
        case ViewState.Loading:
            return (
                loadingChildren ?? <ActivityIndicator testID="loader" size="large" />
            );
        case ViewState.Empty:
            return (
                emptyChildren ?? (
                    <View style={styles.message}>
                        <Text>Nothing to show here yet.</Text>
                    </View>
                )
            );
        case ViewState.Error:
            return (
                errorChildren ?? (
                    <View style={styles.message}>
                        <Text>Something went wrong. Please try again.</Text>
                        {onRetry && <RetryButton onPress={onRetry} />}
                    </View>
                )
            );
        case ViewState.Loaded:
            return loadedChildren;
    }
}

/** Takes remote focus as soon as it appears, so the viewer can just press Select. */
function RetryButton({ onPress }: { onPress: () => void }) {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <Pressable
            focusable={true}
            hasTVPreferredFocus={true}
            onPress={onPress}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            accessibilityRole="button"
            accessibilityLabel="Try again"
            style={[styles.button, isFocused && styles.buttonFocused]}
        >
            <Text>Try again</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    message: {
        padding: 24,
        gap: 12,
        alignItems: "flex-start",
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: "#8a8f98",
    },
    buttonFocused: {
        borderColor: "#007AFF",
    },
});
