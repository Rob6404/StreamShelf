import { catalogDataSource } from "@/data/catalog/CatalogDataSource";
import { Rail } from "@/types/Rail";
import { ViewState } from "@/types/ViewState";
import { useEffect, useState } from "react";

export function useHomeScreen() {
    const [homeScreen, setHomeScreen] = useState<Rail[]>([]);
    const [viewState, setViewState] = useState<ViewState>(ViewState.Loading);

    const loadData = async () => {
        setViewState(ViewState.Loading);

        try {
            const rails = await catalogDataSource.get();
            setHomeScreen(rails);

            console.log(`rails: ${rails}`);
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