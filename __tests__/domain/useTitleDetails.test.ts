import { MyListRepository, myListRepository } from "@/data/myList/MyListRepository";
import { useTitleDetails } from "@/domain/titleDetails/useTitleDetails";
import { fakeStorageProvider } from "../utilities/StorageProvider.test";

test("test addToMyList calls repository.addTitle", () => {
    const repository = new MyListRepository(fakeStorageProvider);
    const repositoryAddTitleSpy = jest.spyOn(repository, "addTitle");
    useTitleDetails(1).addToMyList();

    expect(repositoryAddTitleSpy).toHaveBeenCalled();
});