"use client";
import { adminAccessToken } from "@/constant";
import { isLoggedIn } from "@/service/auth.service";
import { useRouter } from "next/navigation";
import React, { ReactNode, useEffect, useState } from "react";

type Props = {
    children: ReactNode;
};

function AdminProtectedRoute({ children }: Props) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(
        null
    );

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const loggedInStatus = await isLoggedIn(adminAccessToken);

                if (!loggedInStatus) {
                    router.push("/admin/login");
                } else {
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error("Auth check failed:", error);
                router.push("/admin/login");
            }
        };

        checkAuth();
    }, [router]);

    // Show loading state while checking authentication
    if (isAuthenticated === null) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    // Only render children if authenticated
    return isAuthenticated ? <>{children}</> : null;
}

export default AdminProtectedRoute;
