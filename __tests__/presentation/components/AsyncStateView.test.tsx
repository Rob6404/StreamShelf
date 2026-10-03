import AsyncStateView from "@/presentation/components/AsyncStateView";
import { ViewState } from "@/types/ViewState";
import { fireEvent, render } from "@testing-library/react-native";
import { View } from "react-native";

test("renders AsyncStateView as empty when viewState empty", async () => {
    const { getByText } = await render(<AsyncStateView viewState={ViewState.Empty} loadedChildren={<View />} />);
    expect(getByText("Nothing to show here yet.")).toBeTruthy();
});

test("renders AsyncStateView as error when viewState error", async () => {
    const { getByText, queryByText } = await render(<AsyncStateView viewState={ViewState.Error} loadedChildren={<View />} />);
    expect(getByText("Something went wrong. Please try again.")).toBeTruthy();
    // No onRetry, so no button.
    expect(queryByText("Try again")).toBeNull();
});

test("calls onRetry when Try again is pressed", async () => {
    const onRetry = jest.fn();
    const { getByText } = await render(<AsyncStateView viewState={ViewState.Error} loadedChildren={<View />} onRetry={onRetry} />);
    fireEvent.press(getByText("Try again"));
    expect(onRetry).toHaveBeenCalledTimes(1);
});

test("renders AsyncStateView as loading when viewState loading", async () => {
    const { queryByTestId } = await render(<AsyncStateView viewState={ViewState.Loading} loadedChildren={<View />} />);
    expect(queryByTestId("loader")).toBeTruthy();
});
