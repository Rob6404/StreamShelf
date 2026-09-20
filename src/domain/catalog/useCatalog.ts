import { catalogDataSource } from "@/data/catalog/catalogDataSource";
import { Rail } from "@/types/Rail";
import { ViewState } from "@/types/viewState";
import { useEffect, useState } from "react";

export function useHomeScreen() {
    const [homeScreen, setHomeScreen] = useState<Rail[]>([]);
    const [viewState, setViewState] = useState<ViewState>(ViewState.Loading);

    const loadData = async () => {
        setViewState(ViewState.Loading);

        try {
            const rails = await catalogDataSource.get();
            setHomeScreen(rails);

            if (rails.length > 0) {
                setViewState(ViewState.Loaded);
            } else {
                setViewState(ViewState.Empty);
            }
        } catch (error) {
            setViewState(ViewState.Error);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    return { homeScreen, viewState };
}