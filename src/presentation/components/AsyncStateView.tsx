import { ViewState } from "@/types/ViewState";
import { ReactNode } from "react";
import { ActivityIndicator, Text } from "react-native";

export default function AsyncStateView({ viewState, loadedChildren, loadingChildren, errorChildren, emptyChildren }: 
    { viewState: ViewState; loadedChildren: ReactNode; loadingChildren?: ReactNode; errorChildren?: ReactNode; emptyChildren?: ReactNode }) {
    switch (viewState) {
        case ViewState.Loading:
            return (
                loadingChildren ?? <ActivityIndicator size="large" />
            );
        case ViewState.Empty:
            return (
                emptyChildren ?? <Text>EMPTY! Whadda we gonna do now Jim?</Text>
            );
        case ViewState.Error:
            return (
                errorChildren ?? <Text>ERROR! Now we really stuffed things up and dun broke the app! Game over man, game over!</Text>
            );
        case ViewState.Loaded:
            return loadedChildren;
    }
}