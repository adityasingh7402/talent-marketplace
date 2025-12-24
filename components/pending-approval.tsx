"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import BlobBackground from "@/components/blob-background";
import GlitchText from "@/components/glitch-text";
import OnboardingModal from "@/components/talent/onboarding-modal";

export default function PendingApproval({ user }: { user: any }) {
    const [showOnboarding, setShowOnboarding] = useState(!user.onboardingCompleted);

    const handleOnboardingComplete = () => {
        setShowOnboarding(false);
    };

    if (showOnboarding) {
        return (
            <div className="relative min-h-screen w-full bg-black">
                <OnboardingModal user={user} onComplete={handleOnboardingComplete} />
                {/* Optional: Render background behind it if Modal allows transparency, but Modal has its own backdrop */}
            </div>
        );
    }

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center bg-background overflow-hidden selection:bg-primary/20 p-6">
            {/* Background Blobs */}
            <div className="absolute inset-0 z-0">
                <BlobBackground />
                <div className="absolute inset-0 bg-black/70 backdrop-blur-[6px]" />
            </div>

            {/* Noise Texture */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.05] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            <div className="relative z-10 w-full max-w-2xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col items-center text-center space-y-8"
                >
                    <div className="w-24 h-24 bg-primary/10 rounded-3xl border border-primary/20 flex items-center justify-center relative">
                        <Clock className="text-primary w-12 h-12 animate-pulse" />
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full border-4 border-background flex items-center justify-center">
                            <span className="w-1.5 h-1.5 bg-white rounded-full" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest">
                            Review in Progress
                        </div>
                        <h1 className="font-heading text-4xl md:text-6xl font-black tracking-tighter text-white">
                            Request <span className="text-primary italic"><GlitchText speed={0.8}>Submitted.</GlitchText></span>
                        </h1>
                        <p className="text-xl text-white/60 font-medium max-w-lg mx-auto leading-relaxed">
                            Wait some time, we will notify you via <span className="text-white font-bold">{user.email}</span> once your profile is approved by our elite curators.
                        </p>
                    </div>

                    <div className="pt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <Link href="/">
                            <Button variant="outline" className="w-full sm:w-auto h-14 px-8 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold transition-all backdrop-blur-md">
                                Back to Headquarters
                            </Button>
                        </Link>
                        <Link href="mailto:support@talentdirect.com">
                            <Button className="w-full sm:w-auto h-14 px-8 rounded-2xl bg-primary text-primary-foreground font-black hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all">
                                Contact Support
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
