"use client";

import {
    BarChart3,
    Package,
    Users,
    ShoppingCart,
    Settings,
    LayoutDashboard,
    Tags,
    MessageSquare,
    FileText,
    TrendingUp,
    LogOut,
    ChevronDown,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { removeUser } from "@/service/auth.service";
import { adminAccessToken } from "@/constant";

const menuItems = [
    {
        title: "Dashboard",
        url: "/admin",
        icon: LayoutDashboard,
    },
    {
        title: "Products",
        icon: Package,
        items: [
            {
                title: "All Products",
                url: "/products",
            },
            {
                title: "Add Product",
                url: "/products/add",
            },
            {
                title: "Edit Products",
                url: "/products/edit",
            },
            {
                title: "Categories",
                url: "/categories",
            },
        ],
    },
    {
        title: "Orders",
        url: "/orders",
        icon: ShoppingCart,
        badge: "6",
    },
    {
        title: "Users",
        url: "/users",
        icon: Users,
    },
    {
        title: "Analytics",
        url: "/analytics",
        icon: BarChart3,
    },
    {
        title: "Reports",
        url: "/reports",
        icon: FileText,
    },
    {
        title: "Marketing",
        icon: TrendingUp,
        items: [
            {
                title: "Campaigns",
                url: "/marketing/campaigns",
            },
            {
                title: "Coupons",
                url: "/marketing/coupons",
            },
            {
                title: "Promotions",
                url: "/marketing/promotions",
            },
        ],
    },
    {
        title: "Inventory",
        url: "/inventory",
        icon: Tags,
    },
    {
        title: "Messages",
        url: "/messages",
        icon: MessageSquare,
        badge: "3",
    },
];

export function AppSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        removeUser(adminAccessToken);
        router.push("/admin/login");
    };

    return (
        <Sidebar collapsible="icon" className="border-r border-gray-200">
            <SidebarHeader className="">
                <Link href="/" className="flex items-center gap-2">
                    <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl">
                        <span className="text-white font-bold text-xl">R</span>
                    </div>
                    {/* <p>Rangva</p> */}
                </Link>
            </SidebarHeader>

            <SidebarContent className="">
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => {
                                if (item.items) {
                                    return (
                                        <Collapsible
                                            key={item.title}
                                            className="group/collapsible"
                                        >
                                            <SidebarMenuItem>
                                                <CollapsibleTrigger asChild>
                                                    <SidebarMenuButton className="w-full justify-between transition-all duration-200 ease-in-out">
                                                        <div className="flex items-center gap-2">
                                                            <item.icon className="h-4 w-4" />
                                                            <span>
                                                                {item.title}
                                                            </span>
                                                        </div>
                                                        <ChevronDown className="h-4 w-4 transition-transform duration-200 ease-in-out group-data-[state=open]/collapsible:rotate-180" />
                                                    </SidebarMenuButton>
                                                </CollapsibleTrigger>
                                                <CollapsibleContent className="transition-all duration-200 ease-in-out data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                                                    <SidebarMenuSub>
                                                        {item.items.map(
                                                            (subItem) => (
                                                                <SidebarMenuSubItem
                                                                    key={
                                                                        subItem.title
                                                                    }
                                                                >
                                                                    <SidebarMenuSubButton
                                                                        asChild
                                                                    >
                                                                        <Link
                                                                            href={
                                                                                subItem.url
                                                                            }
                                                                            className={`transition-all duration-150 ease-in-out ${
                                                                                pathname ===
                                                                                subItem.url
                                                                                    ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white"
                                                                                    : "hover:bg-gray-100"
                                                                            }`}
                                                                        >
                                                                            {
                                                                                subItem.title
                                                                            }
                                                                        </Link>
                                                                    </SidebarMenuSubButton>
                                                                </SidebarMenuSubItem>
                                                            )
                                                        )}
                                                    </SidebarMenuSub>
                                                </CollapsibleContent>
                                            </SidebarMenuItem>
                                        </Collapsible>
                                    );
                                }

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <Link
                                                href={item.url!}
                                                className={`flex items-center gap-2 ${
                                                    pathname === item.url
                                                        ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white"
                                                        : ""
                                                }`}
                                            >
                                                <item.icon className="h-4 w-4" />
                                                <span>{item.title}</span>
                                                {item.badge && (
                                                    <Badge className="ml-auto bg-red-500 text-white">
                                                        {item.badge}
                                                    </Badge>
                                                )}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-4 border-t border-gray-200">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link
                                href="/settings"
                                className="flex items-center gap-2"
                            >
                                <Settings className="h-4 w-4" />
                                <span>Settings</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 w-full text-left"
                            >
                                <LogOut className="h-4 w-4" />
                                <span>Logout</span>
                            </button>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
