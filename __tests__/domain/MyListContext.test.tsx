import { myListRepository } from "@/data/myList/MyListRepository";
import { MyListProvider, useMyList } from "@/domain/myList/MyListContext";
import { ViewState } from "@/types/ViewState";
import { act, renderHook, waitFor } from "@testing-library/react-native";

afterEach(() => jest.restoreAllMocks());

test("starts Empty when nothing is saved, then add and remove keep the list in sync", async () => {
    jest.spyOn(myListRepository, "getMyList").mockResolvedValue([]);
    jest.spyOn(myListRepository, "addTitle").mockResolvedValue();
    jest.spyOn(myListRepository, "deleteTitle").mockResolvedValue();

    const { result } = await renderHook(() => useMyList(), { wrapper: MyListProvider });
    await waitFor(() => expect(result.current.viewState).toBe(ViewState.Empty));

    await act(async () => {
        await result.current.add({ id: 7, logo: "" });
    });
    expect(result.current.isInMyList(7)).toBe(true);
    expect(result.current.viewState).toBe(ViewState.Loaded);

    await act(async () => {
        await result.current.remove(7);
    });
    expect(result.current.isInMyList(7)).toBe(false);
    expect(result.current.viewState).toBe(ViewState.Empty);
});

test("shows the Error state when the saved list can't be read", async () => {
    jest.spyOn(myListRepository, "getMyList").mockRejectedValue(new Error("storage failed"));

    const { result } = await renderHook(() => useMyList(), { wrapper: MyListProvider });
    await waitFor(() => expect(result.current.viewState).toBe(ViewState.Error));
});

test("useMyList throws a clear error outside the provider", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    await expect(renderHook(() => useMyList())).rejects.toThrow(/MyListProvider/);
});
