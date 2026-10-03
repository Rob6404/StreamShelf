import { catalogDataSource } from "@/data/catalog/CatalogDataSource";
import { Rail } from "@/types/Rail.model";
import { ViewState } from "@/types/ViewState";
import { useEffect, useState } from "react";

export function useHomeScreen() {
    const [homeScreen, setHomeScreen] = useState<Rail[]>([]);
    const [viewState, setViewState] = useState<ViewState>(ViewState.Loading);
    // Bumped by reload() to run the load effect again.
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const rails = await catalogDataSource.get();
                if (cancelled) return;
                setHomeScreen(rails);
                setViewState(rails.length > 0 ? ViewState.Loaded : ViewState.Empty);
            } catch {
                if (!cancelled) setViewState(ViewState.Error);
            }
        })();

        // Ignore a late response if the screen unmounts or reloads first.
        return () => { cancelled = true; };
    }, [attempt]);

    /** Called from the Retry button: show the spinner and load again. */
    const reload = () => {
        setViewState(ViewState.Loading);
        setAttempt(a => a + 1);
    };

    return { homeScreen, viewState, reload };
}
