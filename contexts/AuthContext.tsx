'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
    isChan: boolean;
    setIsChan: (value: boolean) => void;
    logout: () => Promise<void>;
    refreshAuthStatus: () => Promise<void>;
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

    // check auth status
    const refreshAuthStatus = async () => {
        try {
            const res = await fetch('/api/server/amChan');
            const { isChan: isAuth } = await res.json();
            setIsChan(isAuth);
        } catch (err) {
            console.error('Error checking auth status:', err);
            setIsChan(false);
        }
    };

    // check auth status on mount and listen for URL changes
    useEffect(() => {
        refreshAuthStatus(); // initial auth check

        // listen for URL changes that might include the key parameter
        const handleUrlChange = () => {
            const params = new URLSearchParams(window.location.search);
            if (params.has('key')) {
                setTimeout(() => {
                    refreshAuthStatus();
                }, 100);
            }
        };

        handleUrlChange(); // check current URL on mount
        window.addEventListener('popstate', handleUrlChange); // listen for back/forward navigation
        
        return () => {
            window.removeEventListener('popstate', handleUrlChange);
        };
    }, []);

    // delete chanelle's cookie
    const logout = async () => {
        try {
            const response = await fetch('/api/server/setChan', { 
                method: 'DELETE' 
            });
            
            if (response.ok) {
                setIsChan(false); // update context state
                //window.location.reload(); // reload page
            } else {
                console.error('Failed to delete cookie');
            }
        } catch (error) {
            console.error('Error deleting cookie:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ isChan, setIsChan, logout, refreshAuthStatus }}>
            {children}
        </AuthContext.Provider>
    );
}