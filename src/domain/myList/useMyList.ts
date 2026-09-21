import { MyListRepository } from "@/data/myList/MyListRepository";
import { MyListTitle } from "@/types/MyListTitle";
import { Title } from "@/types/Title";
import { ViewState } from "@/types/ViewState";
import { useEffect, useState } from "react";

export function useMyList() {
    const [myList, setMyList] = useState<MyListTitle[]>([]);
    const [viewState, setViewState] = useState<ViewState>(ViewState.Loading);

    const myListRepository = new MyListRepository();
    
    const loadData = async () => {
        setViewState(ViewState.Loading);

        try {
            const myList = await myListRepository.getMyList()

            if (myList.length === 0) {
                setViewState(ViewState.Empty);
            } else {
                setViewState(ViewState.Loaded);
                setMyList(myList);
            }
        } catch (error) {
            setViewState(ViewState.Error);
        }
    };

    // Screen should be unmounted on back navigation, so useEffect doesn't need to always loadData();, that's why we pass empty args
    useEffect(() => {
        loadData();
    }, []);

    return { myList, viewState}
}
