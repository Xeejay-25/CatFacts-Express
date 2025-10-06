// API utility for making requests to the backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface User {
    id?: number;
    name: string;
    email?: string;
    password?: string;
    created_at?: string;
    updated_at?: string;
}

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

// User API functions
export const userApi = {
    // Get all users
    getAllUsers: async (): Promise<User[]> => {
        try {
            const response = await fetch(`${API_BASE_URL}/users`);
            const data: ApiResponse<User[]> = await response.json();
            
            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Failed to fetch users');
            }
            
            return data.data || [];
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    },

    // Get user by ID
    getUserById: async (id: number): Promise<User> => {
        try {
            const response = await fetch(`${API_BASE_URL}/users/${id}`);
            const data: ApiResponse<User> = await response.json();
            
            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Failed to fetch user');
            }
            
            if (!data.data) {
                throw new Error('User not found');
            }
            
            return data.data;
        } catch (error) {
            console.error('Error fetching user:', error);
            throw error;
        }
    },

    // Create new user
    createUser: async (userData: { name: string; email?: string }): Promise<User> => {
        try {
            const response = await fetch(`${API_BASE_URL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            
            const data: ApiResponse<User> = await response.json();
            
            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Failed to create user');
            }
            
            if (!data.data) {
                throw new Error('User creation failed - no data returned');
            }
            
            return data.data;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    },
};

// Local storage functions for current player
export const playerStorage = {
    setCurrentPlayer: (user: User) => {
        localStorage.setItem('currentPlayer', JSON.stringify(user));
    },

    getCurrentPlayer: (): User | null => {
        const playerData = localStorage.getItem('currentPlayer');
        return playerData ? JSON.parse(playerData) : null;
    },

    clearCurrentPlayer: () => {
        localStorage.removeItem('currentPlayer');
    },
};
