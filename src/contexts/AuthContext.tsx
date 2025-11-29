import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/auth.service';

interface User {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is already logged in
        const storedUser = authService.getStoredUser();
        if (storedUser && authService.isAuthenticated()) {
            setUser(storedUser);
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        const response = await authService.login({ email, password });

        // Store tokens
        localStorage.setItem('accessToken', response.tokens.accessToken);
        localStorage.setItem('refreshToken', response.tokens.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.user));

        setUser(response.user);
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
