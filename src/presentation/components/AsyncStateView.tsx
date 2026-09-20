import { ViewState } from "@/types/viewState";
import { ReactNode } from "react";
import { ActivityIndicator, Text } from "react-native";

export default function AsyncStateView(viewState: ViewState, children: () => ReactNode) {    

    switch (viewState) {
        case ViewState.Loading:
            return (
                <ActivityIndicator size="large" />
            );
        case ViewState.Empty:
            return (
                <Text>Whadda we gonna do now Jim?</Text>
            );
        case ViewState.Error:
            return (
                <Text>Now we really stuffed things up and dun broke the app! Game over man, game over!</Text>
            );
        case ViewState.Loaded:
            return children;
    }
}