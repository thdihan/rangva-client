export interface IJWTPayload {
    name: string;
    email: string;
    role: string;
    iat?: number;
    exp?: number;
}
