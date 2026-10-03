import { myListRepository } from "@/data/myList/MyListRepository";
import { MyListTitle } from "@/types/MyListTitle";
import { ViewState } from "@/types/ViewState";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface MyListContextType {
    myList: MyListTitle[]
    viewState: ViewState
    add: (title: MyListTitle) => Promise<void>
    remove: (id: number) => Promise<void>
    isInMyList: (id: number) => boolean
}

const MyListContext = createContext<MyListContextType | null>(null);

export const MyListProvider = ({children}: { children: ReactNode}) => {
    const [myList, setMyList] = useState<MyListTitle[]>([]);
    // Only tracks the initial load: Loading, Loaded or Error.
    const [loadState, setLoadState] = useState<ViewState>(ViewState.Loading);

    // Empty is derived from the list rather than stored, so the two can never disagree.
    const viewState =
        loadState === ViewState.Loaded && myList.length === 0 ? ViewState.Empty : loadState;

    // Optimistic updates: the screen changes immediately, then storage is written.
    // add/remove deliberately don't touch the view state, so screens showing the list
    // don't flash a spinner (and lose remote focus) on every change.
    const add = async (title: MyListTitle) => {
        setMyList(m => [...m, title]);
        await myListRepository.addTitle(title);
    };

    const remove = async (id: number) => {
        setMyList(m => m.filter(title => title.id !== id));
        await myListRepository.deleteTitle(id);
    };

    const isInMyList = (id: number) => myList.some(title => title.id === id);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const saved = await myListRepository.getMyList();
                if (cancelled) return;
                setMyList(saved);
                setLoadState(ViewState.Loaded);
            } catch {
                if (!cancelled) setLoadState(ViewState.Error);
            }
        })();

        return () => { cancelled = true; };
    }, []);

    return (
        <MyListContext.Provider value={{myList, viewState, add, remove, isInMyList}}>
            {children}
        </MyListContext.Provider>
    );
};

export const useMyList = () => {
    const context = useContext(MyListContext);

    if (!context) {
        throw new Error("useMyList needs to be used within a MyListProvider");
    }
    return context;
};
