export interface IJWTPayload {
    email: string;
    role: string;
    iat?: number;
    exp?: number;
}
