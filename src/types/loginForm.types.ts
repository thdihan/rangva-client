export type TLoginForm = {
    email: string;
    password: string;
};

export type TLoginResponse = {
    success: boolean;
    message: string;
    data: {
        accessToken: string;
        needPasswordChange: boolean;
    };
};
