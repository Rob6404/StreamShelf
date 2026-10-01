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
    const [viewState, setViewState] = useState<ViewState>(ViewState.Loading);
    const newViewState =
    viewState === ViewState.Loaded && myList.length === 0 ? ViewState.Empty : viewState;
    
    
    const add = async (title: MyListTitle) => {
        setViewState(ViewState.Loading);
        setMyList(m => [...m, title]);
        await myListRepository.addTitle(title);
        setViewState(ViewState.Loaded);
    };

    const remove = async (id: number) => {
        setMyList(m => m.filter((title) => {
            return title.id !== id
        }));

        await myListRepository.deleteTitle(id);
    };

    const isInMyList = (id: number) => myList.some(title => title.id === id);

    const loadData = async () => {
        try {
            let myList = await myListRepository.getMyList();
            setMyList(myList);
            setViewState(ViewState.Loaded);
        } catch {
            setViewState(ViewState.Error);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <MyListContext.Provider value={{myList, viewState: newViewState, add, remove, isInMyList}}>
            {children}
        </MyListContext.Provider>
    )
};

export const useMyList = () => {
    const context = useContext(MyListContext);

    if (!context) {
        throw new Error("useMyList needs to be used within a MyListProvider");
    }
    return context;
};