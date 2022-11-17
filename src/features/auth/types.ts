export type RegisterRequest = {
    displayName: string;
    email: string;
    password: string;
};

export type LoginRequest = {
    email: string;
    password: string;
};

export type Token = {
    accessToken?: string;
    refreshToken?: string;
};