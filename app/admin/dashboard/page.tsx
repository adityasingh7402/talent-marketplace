import { getCurrentUser } from "@/lib/auth/get-user";
import { redirect } from "next/navigation";
import AdminDashboardClient from "@/components/admin-dashboard-client";

export default async function AdminDashboardPage() {
    const user = await getCurrentUser();

    if (!user || user.roleCategory !== "admin") {
        redirect("/login");
    }

    return <AdminDashboardClient user={user} />;
}
