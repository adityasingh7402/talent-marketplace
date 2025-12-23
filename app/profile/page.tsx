import { getCurrentUser } from "@/lib/auth/get-user";
import { redirect } from "next/navigation";
import ProfileClient from "@/components/profile-client";

export default async function ProfilePage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    // If user is not approved, redirect to dashboard (shows pending message)
    if (user.status !== "approved") {
        redirect("/dashboard");
    }

    return <ProfileClient userId={user.userId} />;
}
