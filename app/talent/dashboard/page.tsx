import { getCurrentUser } from "@/lib/auth/get-user";
import { redirect } from "next/navigation";
import TalentDashboardClient from "@/components/talent-dashboard-client";

export default async function TalentDashboardPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    return <TalentDashboardClient user={user} />;
}
