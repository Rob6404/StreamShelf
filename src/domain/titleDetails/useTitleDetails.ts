import { catalogDataSource } from "@/data/catalog/CatalogDataSource";
import { Title } from "@/types/Title";
import { ViewState } from "@/types/ViewState";
import { useEffect, useState } from "react";
import { useMyList } from "../myList/MyListContext";

export function useTitleDetails(id: number) {
    const [titleDetails, setTitleDetails] = useState<(Title | null)>(null);
    const [viewState, setViewState] = useState<ViewState>(ViewState.Loading);
    const myListContext = useMyList();

    const loadData = async () => {

        try {

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
                await myListContext.add(titleDetails);
            }
        } catch (error) {
            setViewState(ViewState.Error);
        }
    };

    const removeFromMyList = async () => {
        try {
            if (titleDetails) {
                await myListContext.remove(titleDetails.id);
            }
        } catch (error) {
            setViewState(ViewState.Error);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    return { titleDetails, viewState, isMyList: myListContext.isInMyList(id), addToMyList, removeFromMyList };
}