import { getCurrentUser } from "@/lib/auth/get-user";
import { redirect } from "next/navigation";
import TalentDashboardClient from "@/components/talent-dashboard-client";
import { supabase } from "@/lib/db/supabase";

export default async function TalentDashboardPage() {
    const session = await getCurrentUser();

    if (!session) {
        redirect("/login");
    }

    // Fetch the actual user record from the database to get fresh dynamic data
    const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.userId)
        .single();

    if (error || !user) {
        // If user record is missing but token is valid, something is wrong
        redirect("/login");
    }

    return <TalentDashboardClient user={user} />;
}
