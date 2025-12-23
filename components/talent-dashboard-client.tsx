"use client";

import { useState } from "react";
import {
    Star, Film, User, Settings, LogOut, Menu, X, Bell,
    Sparkles, ShieldCheck, Heart, Camera, LayoutGrid
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ModeToggle } from "@/components/mode-toggle";
import BlobBackground from "@/components/blob-background";
import Portfolio from "./talent/portfolio";
import TalentSettings from "./talent/talent-settings";
import OnboardingModal from "./talent/onboarding-modal";

type TalentView = 'portfolio' | 'profile' | 'notifications' | 'settings';

export default function TalentDashboardClient({ user }: { user: any }) {
    const router = useRouter();
    const [activeView, setActiveView] = useState<TalentView>('portfolio');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(user?.onboarding_completed || false);

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            toast.success("Signed out of the Grid");
            router.push("/login");
        } catch (error) {
            toast.error("Logout failed");
        }
    };

    const renderView = () => {
        switch (activeView) {
            case 'portfolio':
                return <Portfolio />;
            case 'settings':
                return <TalentSettings />;
            case 'profile':
                return (
                    <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
                        <User className="w-16 h-16 text-white/5" />
                        <div>
                            <h2 className="text-2xl font-bold text-white uppercase tracking-tighter">Profile Designer</h2>
                            <p className="text-white/40">This section is being calibrated for your role.</p>
                        </div>
                    </div>
                );
            case 'notifications':
                return (
                    <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
                        <Bell className="w-16 h-16 text-white/5" />
                        <div>
                            <h2 className="text-2xl font-bold text-white uppercase tracking-tighter">Signal Center</h2>
                            <p className="text-white/40">No new casting signals detected in your sector.</p>
                        </div>
                    </div>
                );
            default:
                return <Portfolio />;
        }
    };

    const menuItems = [
        { id: 'portfolio', label: 'My Portfolio', icon: LayoutGrid },
        { id: 'profile', label: 'Edit Profile', icon: User },
        { id: 'notifications', label: 'Casting Signals', icon: Bell },
        { id: 'settings', label: 'Dashboard Settings', icon: Settings },
    ];

    return (
        <div className="relative min-h-screen w-full bg-background overflow-hidden selection:bg-primary/20">
            {/* Background Layer */}
            <div className="absolute inset-0 z-0">
                <BlobBackground />
                <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-[2px]" />

                {/* Extra Ambient Glows */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
                <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            </div>

            {/* Content Layer */}
            <div className="relative z-10 flex h-screen overflow-hidden">
                {/* Sidebar */}
                <AnimatePresence mode="wait">
                    {isSidebarOpen && (
                        <motion.aside
                            initial={{ x: -300, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -300, opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="w-72 border-r border-white/5 bg-zinc-950/50 backdrop-blur-2xl flex flex-col p-6 z-50 absolute md:relative h-full"
                        >
                            <div className="flex items-center justify-between mb-12">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/20 transform -rotate-3">
                                        <Star className="text-white w-6 h-6 fill-white" />
                                    </div>
                                    <div>
                                        <span className="block font-heading font-black text-xl leading-none text-white tracking-tighter">TalentGrid</span>
                                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/60">Creative</span>
                                    </div>
                                </div>
                                <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-white/40 hover:text-white">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <nav className="space-y-1 grow">
                                {menuItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveView(item.id as TalentView)}
                                        className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden cursor-target ${activeView === item.id
                                            ? 'bg-primary/10 text-primary shadow-inner shadow-white/5'
                                            : 'text-white/40 hover:bg-white/5 hover:text-white'
                                            }`}
                                    >
                                        {activeView === item.id && (
                                            <motion.div
                                                layoutId="talent-active-tab"
                                                className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                                            />
                                        )}
                                        <item.icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${activeView === item.id ? 'text-primary' : 'text-inherit'}`} />
                                        <span className="font-bold text-sm tracking-tight">{item.label}</span>
                                    </button>
                                ))}
                            </nav>

                            <div className="mt-8 space-y-4 pt-4 border-t border-white/5">
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3 text-left">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <ShieldCheck className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-xs font-bold text-white truncate">{user?.first_name} {user?.last_name}</p>
                                        <p className="text-[10px] text-white/40 uppercase tracking-widest font-black">{user?.role || 'Talent'}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-red-500/60 hover:text-red-500 hover:bg-red-500/5 transition-all duration-300 group cursor-target"
                                >
                                    <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                    <span className="font-bold text-sm">Return to Base</span>
                                </button>
                            </div>
                        </motion.aside>
                    )}
                </AnimatePresence>

                {/* Main Content */}
                <main className="grow flex flex-col h-screen overflow-hidden relative">
                    {/* Header for mobile or when sidebar is closed */}
                    <header className="flex items-center justify-between p-6 border-b border-white/5 md:border-none">
                        {!isSidebarOpen && (
                            <button onClick={() => setIsSidebarOpen(true)} className="p-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all cursor-target">
                                <Menu className="w-6 h-6" />
                            </button>
                        )}
                        <div className="ml-auto flex items-center gap-4">
                            <ModeToggle />
                            <div className="px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                Signal Active
                            </div>
                        </div>
                    </header>

                    <div className="grow overflow-y-auto custom-scrollbar px-6 md:px-10 pb-10" data-lenis-prevent>
                        <div className="max-w-380 mx-auto">
                            <header className="mb-12">
                                <motion.h1
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-4xl md:text-5xl font-heading font-black tracking-tighter text-white mb-2"
                                >
                                    {activeView === 'portfolio' ? 'Cinematic' : activeView.charAt(0).toUpperCase() + activeView.slice(1)} <span className="text-primary italic">{activeView === 'portfolio' ? 'Workspace.' : 'Center.'}</span>
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-white/60 font-medium"
                                >
                                    {activeView === 'portfolio' ? 'Showcase your talent to the industry leaders.' : `Manage your ${activeView} preferences.`}
                                </motion.p>
                            </header>

                            <div className="relative">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeView}
                                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 1.02, y: -10 }}
                                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                    >
                                        {renderView()}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            {/* Onboarding Overlay */}
            {!isOnboardingCompleted && (
                <OnboardingModal
                    user={user}
                    onComplete={() => setIsOnboardingCompleted(true)}
                />
            )}
        </div>
    );
}
