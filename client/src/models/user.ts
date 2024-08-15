export interface User {
    username: string;
    displayName: string;
    token: string;
    photoUrl?: string;
    gender: string;
    native: string;
}

export interface UserFormValues {
    email: string;
    password: string;
    displayName?: string;
    username?: string;
    gender?: string;
    birthday?: string;
    native?: string;
    learn?: string;
    level?: string;
    city?: string;
    country?: string;
}