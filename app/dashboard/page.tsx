import { getCurrentUser } from "@/lib/auth/get-user";
import { redirect } from "next/navigation";
import PendingApproval from "@/components/pending-approval";
import { supabaseAdmin } from "@/lib/db/supabase";

export default async function DashboardEntry() {
    let user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    // If status is NOT approved in the token, check the database for updates
    // This handles the case where a user verifies email or gets approved
    // but their JWT token still has the old "pending" status
    if (user.status !== "approved") {
        try {
            const admin = supabaseAdmin();
            const { data: dbUser } = await admin
                .from("users")
                .select("status, role_category")
                .eq("id", user.userId)
                .single();

            if (dbUser && dbUser.status === "approved") {
                // Determine correct role category logic if needed, but here just trusting DB
                user = {
                    ...user,
                    status: "approved",
                    roleCategory: dbUser.role_category || user.roleCategory
                };
            }
        } catch (error) {
            console.error("Error fetching fresh user status:", error);
            // Fallback to token status
        }
    }

    // If status is STILL not approved, show the pending message
    if (user.status !== "approved") {
        return <PendingApproval email={user.email} />;
    }

    // If approved, redirect to specific dashboard
    if (user.roleCategory === "admin") {
        redirect("/admin/dashboard");
    } else {
        redirect("/talent/dashboard");
    }
}
