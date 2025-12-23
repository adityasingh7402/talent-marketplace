import { getCurrentUser } from "@/lib/auth/get-user";
import { redirect } from "next/navigation";
import PendingApproval from "@/components/pending-approval";

export default async function DashboardEntry() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    // If status is NOT approved, show the pending message
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
