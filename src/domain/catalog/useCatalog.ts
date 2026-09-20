import { catalogDataSource } from "@/data/catalog/CatalogDataSource";
import { Rail } from "@/types/Rail.model";
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

    // Screen data is static, so useEffect doesn't need to always loadData(); that's why we pass empty args.
    useEffect(() => {
        loadData();
    }, []);

    return { homeScreen, viewState };
}