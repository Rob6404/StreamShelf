import { catalogDataSource } from "@/data/catalog/CatalogDataSource";
import { myListRepository } from "@/data/myList/MyListRepository";
import { useTitleDetails } from "@/domain/titleDetails/useTitleDetails";
import { Rail } from "@/types/Rail.model";
import { act, renderHook, waitFor } from "@testing-library/react-native";

const fakeRails: Rail[] = [
    {
        id: 1, title: "Rail", titles: [
            { id: 1, description: "A title", logo: "", metaData: { createdAt: new Date() } },
        ]
    },
];

test("test addToMyList calls repository.addTitle", async () => {
    jest.spyOn(catalogDataSource, "get").mockResolvedValue(fakeRails);
    jest.spyOn(myListRepository, "get").mockResolvedValue(null);
    const repositoryAddTitleSpy = jest.spyOn(myListRepository, "addTitle").mockResolvedValue();

    const { result } = await renderHook(() => useTitleDetails(1));
    await waitFor(() => expect(result.current.titleDetails).not.toBeNull());

    await act(async () => {
        await result.current.addToMyList();
    });

    expect(repositoryAddTitleSpy).toHaveBeenCalled();
});
