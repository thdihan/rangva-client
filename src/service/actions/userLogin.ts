"use server";

import { TLoginForm, TLoginResponse } from "@/types/loginForm.types";

export const userLogin = async (data: TLoginForm): Promise<TLoginResponse> => {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            cache: "no-store",
        }
    );
    const userInfo = await res.json();
    return userInfo;
};
