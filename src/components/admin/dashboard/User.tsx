"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserInfo, removeUser } from "@/service/auth.service";
import { adminAccessToken } from "@/constant";
import { useRouter } from "next/navigation";

type Props = {};

const getAvatar = (name: string) => {
    return name
        ?.split(" ")
        .map((ns) => ns[0])
        .join("")
        .substring(0, 2);
};

function User({}: Props) {
    const userInfo = getUserInfo(adminAccessToken);
    const router = useRouter();

    console.log("[LOG] Header.tsx : adminAccessToken", userInfo);

    const handleLogout = () => {
        removeUser(adminAccessToken);
        router.push("/admin/login");
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback>
                            {getAvatar(userInfo?.name as string)}
                        </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline">{userInfo?.name}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator /> */}
                <DropdownMenuItem onClick={handleLogout}>
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default User;
