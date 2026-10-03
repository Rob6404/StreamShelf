import { catalogDataSource } from "@/data/catalog/CatalogDataSource";
import { Title } from "@/types/Title";
import { ViewState } from "@/types/ViewState";
import { useEffect, useState } from "react";
import { useMyList } from "../myList/MyListContext";

export function useTitleDetails(id: number) {
    const [titleDetails, setTitleDetails] = useState<(Title | null)>(null);
    const [viewState, setViewState] = useState<ViewState>(ViewState.Loading);
    // Bumped by reload() to run the load effect again.
    const [attempt, setAttempt] = useState(0);
    const myListContext = useMyList();

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const title = (await catalogDataSource.get())
                    .flatMap(rail => rail.titles)
                    .find(t => t.id === id);
                if (cancelled) return;

                if (title) {
                    setTitleDetails(title);
                    setViewState(ViewState.Loaded);
                } else {
                    setViewState(ViewState.Empty);
                }
            } catch {
                if (!cancelled) setViewState(ViewState.Error);
            }
        })();

        // Ignore a late response if the id changes or the screen unmounts first.
        return () => { cancelled = true; };
    }, [id, attempt]);

    /** Called from the Retry button: show the spinner and load again. */
    const reload = () => {
        setViewState(ViewState.Loading);
        setAttempt(a => a + 1);
    };

    const addToMyList = async () => {
        try {
            if (titleDetails) {
                await myListContext.add(titleDetails);
            }
        } catch {
            setViewState(ViewState.Error);
        }
    };

    const removeFromMyList = async () => {
        try {
            if (titleDetails) {
                await myListContext.remove(titleDetails.id);
            }
        } catch {
            setViewState(ViewState.Error);
        }
    };

    return {
        titleDetails,
        viewState,
        isMyList: myListContext.isInMyList(id),
        addToMyList,
        removeFromMyList,
        reload,
    };
}
