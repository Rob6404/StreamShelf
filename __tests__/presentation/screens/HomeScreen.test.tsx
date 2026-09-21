import HomeScreen from "@/app";
import AsyncStateView from "@/presentation/components/AsyncStateView";
import { ViewState } from "@/types/ViewState";
import { render } from "@testing-library/react-native";
import { View } from "react-native";

test("renders AsyncStateView as empty when viewState empty", async() => {
    const { getByText } = await render(<AsyncStateView viewState={ViewState.Empty} loadedChildren={<View />} />);
    expect(getByText(/EMPTY! Whadda we gonna do now Jim?/)).toBeTruthy();
});

test("renders AsyncStateView as error when viewState error", async() => {
    const { getByText } = await render(<AsyncStateView viewState={ViewState.Error} loadedChildren={<View />} />);
    expect(getByText(/ERROR! Now we really stuffed things up and dun broke the app! Game over man, game over!/)).toBeTruthy();
});

test("renders AsyncStateView as loading when viewState loading", async() => {
    const { queryByTestId } = await render(<AsyncStateView viewState={ViewState.Loading} loadedChildren={<View />} />);
    expect(queryByTestId("loader")).toBeTruthy();
});