export interface CatFact {
    id?: number;
    fact: string;
    length: number;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface Game {
    id?: number;
    user_id?: number;
    session_id: string;
    difficulty: 'easy' | 'medium' | 'hard';
    score: number;
    moves: number;
    time_elapsed: number;
    matched_pairs: number;
    total_pairs: number;
    status: 'playing' | 'won' | 'abandoned';
    collected_facts?: number[];
    completed_at?: string;
    created_at?: string;
    updated_at?: string;
}

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

export interface CatFactApiResponse {
    fact: string;
    length?: number;
}

export interface GameStatistics {
    total_games: number;
    completed_games: number;
    abandoned_games: number;
    average_score: number;
    average_time: number;
    best_score: number;
    difficulty_distribution: {
        easy: number;
        medium: number;
        hard: number;
    };
}

export interface CatFactStatistics {
    total_facts: number;
    active_facts: number;
    inactive_facts: number;
    average_length: number;
    shortest_length: number;
    longest_length: number;
    length_distribution?: {
        short: number;
        medium: number;
        long: number;
    };
}

export interface LeaderboardEntry {
    id: number;
    user_id?: number;
    user_name: string;
    score: number;
    time_elapsed: number;
    difficulty: string;
    created_at: string;
}

export interface AuthUser {
    id: number;
    name: string;
    email?: string;
}

export interface JwtPayload {
    userId: number;
    name: string;
    iat?: number;
    exp?: number;
}

export type DatabaseRow = { [key: string]: any };