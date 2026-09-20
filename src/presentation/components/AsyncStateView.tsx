import { ViewState } from "@/types/ViewState";
import { ReactNode } from "react";
import { ActivityIndicator, Text } from "react-native";

export default function AsyncStateView({ viewState, children }: { viewState: ViewState; children: ReactNode }) {    
    console.log(viewState);
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