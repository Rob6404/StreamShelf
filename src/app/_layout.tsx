import { MyListProvider } from "@/domain/myList/MyListContext";
import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <MyListProvider>
            <Stack>
                <Stack.Screen name="index" options={{ title: "Home" }} />
                <Stack.Screen name="details/[id]" options={{ title: "Title Details" }} />
                <Stack.Screen name="my-list" options={{ title: "My List"}} />
                <Stack.Screen name="video-player" options={{ title: "Video Player" }} />
            </Stack>
        </MyListProvider>
    );
}