import { catalogDataSource } from "@/data/catalog/CatalogDataSource";
import { MyListRepository } from "@/data/myList/MyListRepository";
import { Title } from "@/types/Title";
import { ViewState } from "@/types/ViewState";
import { useEffect, useState } from "react";

export function useTitleDetails(id: number) {
    const [titleDetails, setTitleDetails] = useState<(Title | null)>(null);
    const [viewState, setViewState] = useState<ViewState>(ViewState.Loading);
    const [isMyList, setIsMyList] = useState<boolean>(false);

    const myListRepository = new MyListRepository();

    const loadData = async () => {
        setViewState(ViewState.Loading);

        try {
            
            const myListTitle = await myListRepository.get(id);
            setIsMyList(myListTitle !== null);

            const title = (await catalogDataSource.get())
            .flatMap(rail => rail.titles)
            .find(title => title.id === id);

            if (title) {
                setTitleDetails(title);
                setViewState(ViewState.Loaded);
            } else {
                setViewState(ViewState.Empty);
            }
        } catch (error) {
            setViewState(ViewState.Error);
        }
    };

    const addToMyList = async () => {
        try {
            if (titleDetails) {
                await myListRepository.addTitle(titleDetails);
                setIsMyList(true);
            }
        } catch (error) {
            setViewState(ViewState.Error);
        }
    };

    const removeFromMyList = async () => {
        try {
            if (titleDetails) {
                await myListRepository.deleteTitle(titleDetails.id);
                setIsMyList(false);
            }
        } catch (error) {
            setViewState(ViewState.Error);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    return { titleDetails, viewState, isMyList, addToMyList, removeFromMyList };
}