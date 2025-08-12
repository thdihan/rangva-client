import { decodedToken } from "@/utils/jwt";

import {
    getFromLocalStorage,
    removeFromLocalStorage,
    setToLocalStorage,
} from "@/utils/local-storage";

export const storeUserInfo = ({
    authKey,
    accessToken,
}: {
    authKey: string;
    accessToken: string;
}) => {
    //   console.log(accessToken);
    return setToLocalStorage(authKey, accessToken);
};

export const getUserInfo = (authKey: string) => {
    const authToken = getFromLocalStorage(authKey);
    //   console.log(authToken);
    if (authToken) {
        const decodedData: any = decodedToken(authToken);
        return {
            ...decodedData,
            role: decodedData?.role.toLowerCase(),
        };
    }
};

export const isLoggedIn = (authKey: string) => {
    const authToken = getFromLocalStorage(authKey);
    if (authToken) {
        return !!authToken;
    }
};

export const removeUser = (authKey: string) => {
    return removeFromLocalStorage(authKey);
};
