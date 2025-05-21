'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface ViewModeProps {
    publicMode: boolean,
    setPublicMode: (arg: boolean) => void,
    toggleMode: () => void
}

const ViewModeContext = createContext<ViewModeProps | undefined>(undefined); // defining the structure of the context

// custom hook for getting this context
export function useViewModeContext() {
    const value = useContext(ViewModeContext);
    if (!value) {
        throw new Error('ViewModeContext is undefined.');
    }
    return value;
}

// defining all the props in the context and returning the provider
export function ViewModeProvider({ children }: { children: ReactNode }) {
    const [publicMode, setPublicMode] = useState<boolean>(false); // state for whether chanelle in is public mode or not

    // toggles publicMode state
    const toggleMode = () => {
        setPublicMode(!publicMode);
    }

    return (
        <ViewModeContext.Provider 
            value={{
                publicMode: publicMode,
                setPublicMode: setPublicMode,
                toggleMode: toggleMode
            }}
        >
            {children}
        </ViewModeContext.Provider>
    );
}

