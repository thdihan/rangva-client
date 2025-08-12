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
import { getUserInfo } from "@/service/auth.service";
import { adminAccessToken } from "@/constant";

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

    console.log("[LOG] Header.tsx : adminAccessToken", userInfo);

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
                <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default User;
