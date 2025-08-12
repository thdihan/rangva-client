"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

import { SidebarTrigger } from "@/components/ui/sidebar";
import User from "./User";

export function Header() {
    return (
        <header className="flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-6">
            <SidebarTrigger />

            <div className="flex-1 flex items-center gap-4">
                <div className="relative max-w-md flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                        placeholder="Search for products, orders etc..."
                        className="pl-10 bg-gray-50 border-0"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* <NotificationSidebar /> */}

                <User />
            </div>
        </header>
    );
}
