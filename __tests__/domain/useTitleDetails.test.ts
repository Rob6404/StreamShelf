import { catalogDataSource } from "@/data/catalog/CatalogDataSource";
import { myListRepository } from "@/data/myList/MyListRepository";
import { MyListProvider } from "@/domain/myList/MyListContext";
import { useTitleDetails } from "@/domain/titleDetails/useTitleDetails";
import { Rail } from "@/types/Rail.model";
import { ViewState } from "@/types/ViewState";
import { act, renderHook, waitFor } from "@testing-library/react-native";

const fakeRails: Rail[] = [
    {
        id: 1, title: "Rail", titles: [
            { id: 1, description: "A title", logo: "", videoUrl: "", metaData: { createdAt: new Date() } },
        ]
    },
];

afterEach(() => jest.restoreAllMocks());

test("addToMyList saves the title and updates the shared list", async () => {
    jest.spyOn(catalogDataSource, "get").mockResolvedValue(fakeRails);
    jest.spyOn(myListRepository, "getMyList").mockResolvedValue([]);
    const repositoryAddTitleSpy = jest.spyOn(myListRepository, "addTitle").mockResolvedValue();

    const { result } = await renderHook(() => useTitleDetails(1), {wrapper: MyListProvider});
    await waitFor(() => expect(result.current.titleDetails).not.toBeNull());

    await act(async () => {
        await result.current.addToMyList();
    });

    expect(repositoryAddTitleSpy).toHaveBeenCalled();
    expect(result.current.isMyList).toBe(true);
});

test("reload recovers from a failed catalog load", async () => {
    jest.spyOn(myListRepository, "getMyList").mockResolvedValue([]);
    jest.spyOn(catalogDataSource, "get")
        .mockRejectedValueOnce(new Error("Unable to load catalog"))
        .mockResolvedValue(fakeRails);

    const { result } = await renderHook(() => useTitleDetails(1), {wrapper: MyListProvider});
    await waitFor(() => expect(result.current.viewState).toBe(ViewState.Error));

    await act(async () => {
        result.current.reload();
    });

    await waitFor(() => expect(result.current.viewState).toBe(ViewState.Loaded));
    expect(result.current.titleDetails?.id).toBe(1);
});
