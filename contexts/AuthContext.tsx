'use client'
/*
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
                window.location.reload(); // reload page
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
*/

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    isChan: boolean;
    setIsChan: (value: boolean) => void;
    logout: () => Promise<void>;
    refreshAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
} 

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isChan, setIsChan] = useState<boolean>(false);
    const router = useRouter(); // Initialize useRouter

    const refreshAuthStatus = async () => {
        try {
            const res = await fetch('/api/server/amChan');
            if (!res.ok) { // Check if response is okay
                throw new Error(`API responded with status: ${res.status}`);
            }
            const data = await res.json();
            setIsChan(data.isChan);
        } catch (err) {
            console.error('Error checking auth status:', err);
            setIsChan(false);
        }
    };

    useEffect(() => {
        refreshAuthStatus();

        const handleUrlChange = () => {
            const params = new URLSearchParams(window.location.search);
            if (params.has('key')) {
                setTimeout(() => {
                    refreshAuthStatus().then(() => {
                        // Optionally, remove the key from URL after processing
                        const currentUrl = new URL(window.location.href);
                        currentUrl.searchParams.delete('key');
                        window.history.replaceState({}, '', currentUrl.toString());
                    });
                }, 200); // Increased timeout slightly
            }
        };

        handleUrlChange();
        window.addEventListener('popstate', handleUrlChange);
        
        // Listen for 'focus' event to re-check auth when tab is refocused
        // This helps if the cookie was changed in another tab
        const handleFocus = () => {
            refreshAuthStatus();
        };
        window.addEventListener('focus', handleFocus);
        
        return () => {
            window.removeEventListener('popstate', handleUrlChange);
            window.removeEventListener('focus', handleFocus);
        };
    }, []);

    const logout = async () => {
        try {
            const response = await fetch('/api/server/setChan', { 
                method: 'DELETE' 
            });
            
            if (response.ok) {
                setIsChan(false); // Optimistically update UI

                // Attempt to clear cookie client-side as a fallback
                document.cookie = "isChan=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;";
                
                // Use Next.js router.refresh() to re-fetch server components
                // and re-run middleware. This is better for cache.
                router.refresh(); 

                // Wait a bit for router.refresh() and then do a full reload
                // to ensure everything is cleared, especially in production.
                setTimeout(() => {
                    window.location.reload();
                }, 300); // Adjust timeout as needed

            } else {
                console.error('Failed to delete cookie from server');
                // Optionally, inform the user that logout might not have been complete
            }
        } catch (error) {
            console.error('Error during logout process:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ isChan, setIsChan, logout, refreshAuthStatus }}>
            {children}
        </AuthContext.Provider>
    );
}