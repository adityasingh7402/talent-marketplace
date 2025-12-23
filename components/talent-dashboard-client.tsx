"use client";

import { Button } from "@/components/ui/button";
import { Star, User, Film, Star as StarIcon, Settings, LogOut, Bell } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TalentDashboardClient({ user }: { user: any }) {
    const router = useRouter();

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/login");
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <nav className="border-b border-border/40 px-8 py-4 flex justify-between items-center glass sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <Star className="text-white w-5 h-5 fill-white" />
                    </div>
                    <span className="font-heading font-bold text-xl tracking-tight">TalentDirect.</span>
                </div>

                <div className="flex items-center gap-6">
                    <Link href="/talent/notifications" className="text-white/60 hover:text-white relative">
                        <Bell className="w-6 h-6" />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
                    </Link>
                    <div className="flex items-center gap-3 pl-6 border-l border-white/10">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-white leading-none">Creative Professional</p>
                            <p className="text-xs text-white/40">{user?.email}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                            <User className="w-5 h-5 text-primary" />
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex flex-1">
                <aside className="w-64 border-r border-border/40 p-6 space-y-2 hidden md:block">
                    <Link href="/talent/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary font-bold transition-all">
                        <Film className="w-5 h-5" />
                        My Portfolio
                    </Link>
                    <Link href="/talent/profile/edit" className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-white/5 hover:text-white transition-all">
                        <StarIcon className="w-5 h-5" />
                        My Reels
                    </Link>
                    <Link href="/talent/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-white/5 hover:text-white transition-all">
                        <Settings className="w-5 h-5" />
                        Profile Settings
                    </Link>

                    <div className="pt-6 mt-6 border-t border-border/40">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/5 transition-all w-full text-left"
                        >
                            <LogOut className="w-5 h-5" />
                            Sign Out
                        </button>
                    </div>
                </aside>

                <main className="grow p-8 bg-zinc-950/20">
                    <div className="max-w-5xl mx-auto space-y-12">
                        <section className="space-y-6">
                            <div className="flex justify-between items-end">
                                <div>
                                    <h2 className="text-4xl font-heading font-black tracking-tight text-white">Your Portfolio</h2>
                                    <p className="text-white/60 font-medium">Manage your cinematic presence on the grid.</p>
                                </div>
                                <Button className="h-12 px-6 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all">
                                    Edit Profile
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="aspect-4/5 rounded-4xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-center p-8 hover:border-primary/40 transition-all group cursor-pointer">
                                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Film className="w-8 h-8 text-white/20" />
                                    </div>
                                    <p className="text-white font-bold mb-1">Add New Reel</p>
                                    <p className="text-white/40 text-sm">Upload your latest performance</p>
                                </div>
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
}
