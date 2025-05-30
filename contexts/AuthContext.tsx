'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
    isChan: boolean;
    setIsChan: (value: boolean) => void;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// custom hook for getting this context
export function useAuthContext() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
} 

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isChan, setIsChan] = useState<boolean>(false);

    // set isChan flag by getting the state of the cookie via api
    useEffect(() => {
        fetch('/api/server/amChan')
            .then(res => res.json())
            .then(({ isChan }) => setIsChan(isChan))
            .catch(err => {
                console.error(err);
                setIsChan(false);
            });
    }, []);

    // delete chanelle's cookie
    const logout = async () => {
        try {
            const response = await fetch('/api/server/setChan', { 
                method: 'DELETE' 
            });
            
            if (response.ok) {
                setIsChan(false); // Update context state
            } else {
                console.error('Failed to delete cookie');
            }
        } catch (error) {
            console.error('Error deleting cookie:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ isChan, setIsChan, logout }}>
            {children}
        </AuthContext.Provider>
    );
}