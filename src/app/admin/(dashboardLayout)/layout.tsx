import { AppSidebar } from "@/components/admin/dashboard/app-sidebar";
import { Header } from "@/components/admin/dashboard/Header";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminProtectedRoute from "../AdminProtectedRoute";

const AdminDashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <AdminProtectedRoute>
            <SidebarProvider>
                <AppSidebar />
                <main className="flex-1 flex flex-col">
                    <Header />
                    <main className="flex-1 p-6 bg-gray-50">{children}</main>
                </main>
            </SidebarProvider>
        </AdminProtectedRoute>
    );
};

export default AdminDashboardLayout;
