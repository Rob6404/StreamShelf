import { MyListTitle } from "@/types/MyListTitle";
import { Title } from "@/types/Title";
import { ViewState } from "@/types/ViewState";
import { useEffect, useState } from "react";

export function useMyList() {
    // TODO: Should we use title as persistance for mylist, or not? what does mylist screen show?
    const [myList, setMyList] = useState<MyListTitle[]>([]);
    const [viewState, setViewState] = useState<ViewState>(ViewState.Loading);
    
    const loadData = async () => {

    };

    // Screen should be unmounted on back navigation, so useEffect doesn't need to always loadData();, that's why we pass empty args
    useEffect(() => {
        loadData();
    }, []);

    return { myList, viewState}
}
