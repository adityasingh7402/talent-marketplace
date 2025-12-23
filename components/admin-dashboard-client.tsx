"use client";

import { Button } from "@/components/ui/button";
import { Star, LayoutDashboard, Users, MessageSquare, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminDashboardClient({ user }: { user: any }) {
    const router = useRouter();

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/login");
    };

    return (
        <div className="min-h-screen bg-background flex">
            <aside className="w-64 border-r border-border/40 bg-card/30 backdrop-blur-md hidden md:flex flex-col p-6">
                <div className="flex items-center gap-2 mb-10">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <Star className="text-white w-5 h-5 fill-white" />
                    </div>
                    <span className="font-heading font-bold text-xl tracking-tight">AdminGrid.</span>
                </div>

                <nav className="space-y-2 grow">
                    <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary font-bold transition-all">
                        <LayoutDashboard className="w-5 h-5" />
                        Overview
                    </Link>
                    <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-white/5 hover:text-white transition-all">
                        <Users className="w-5 h-5" />
                        Talent Review
                    </Link>
                    <Link href="/admin/leads" className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-white/5 hover:text-white transition-all">
                        <MessageSquare className="w-5 h-5" />
                        Leads
                    </Link>
                    <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-white/5 hover:text-white transition-all">
                        <Settings className="w-5 h-5" />
                        Settings
                    </Link>
                </nav>

                <div className="pt-6 border-t border-border/40">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/5 transition-all w-full text-left"
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            <main className="grow p-8">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-heading font-black tracking-tight text-white mb-1">Command Center</h1>
                        <p className="text-white/60 font-medium">Welcome back, {user?.email}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest">
                            Admin Mode
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass p-6 rounded-3xl border border-white/5 flex flex-col justify-between h-40">
                        <span className="text-white/40 text-sm font-bold uppercase tracking-widest">Pending Approvals</span>
                        <span className="text-5xl font-heading font-black text-white">12</span>
                    </div>
                    <div className="glass p-6 rounded-3xl border border-white/5 flex flex-col justify-between h-40">
                        <span className="text-white/40 text-sm font-bold uppercase tracking-widest">Total Talent</span>
                        <span className="text-5xl font-heading font-black text-white">1,204</span>
                    </div>
                    <div className="glass p-6 rounded-3xl border border-white/5 flex flex-col justify-between h-40">
                        <span className="text-white/40 text-sm font-bold uppercase tracking-widest">Open Leads</span>
                        <span className="text-5xl font-heading font-black text-primary">48</span>
                    </div>
                </div>
            </main>
        </div>
    );
}
