import api from '../lib/axios';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    user: {
        id: string;
        email: string;
        firstname: string;
        lastname: string;
        role: string;
    };
    tokens: {
        accessToken: string;
        refreshToken: string;
    };
}

export const authService = {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const { data } = await api.post('/auth/login', credentials);
        return data.data;
    },

    async refreshToken(): Promise<{ accessToken: string; refreshToken: string }> {
        const { data } = await api.post('/auth/refresh');
        return data.data;
    },

    logout() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    },

    getStoredUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    isAuthenticated(): boolean {
        return !!localStorage.getItem('accessToken');
    },
};
