"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import BlobBackground from "@/components/blob-background";
import Magnetic from "@/components/magnetic";
import GlitchText from "@/components/glitch-text";

export default function NotFound() {
    return (
        <div className="relative min-h-screen w-full flex flex-col bg-background overflow-hidden selection:bg-primary/20">
            {/* Background Blobs - Slightly darker overlay */}
            <div className="absolute inset-0 z-0">
                <BlobBackground />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
            </div>

            {/* Noise Texture */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.05] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            {/* Large 404 Background Text - HIGHER VISIBILITY */}
            <div className="absolute inset-0 flex items-center justify-center z-1 overflow-hidden pointer-events-none">
                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{
                        opacity: [0.3, 0.5, 0.3],
                        y: [0, -40, 0],
                        x: [0, 20, 0],
                        rotate: [-2, 2, -2]
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="text-[25rem] md:text-[45rem] font-black leading-none tracking-tighter select-none"
                    style={{
                        color: "transparent",
                        WebkitTextStroke: "2px rgba(255,255,255,0.2)",
                        filter: "drop-shadow(0 0 30px rgba(239, 68, 68, 0.1))",
                    }}
                >
                    404
                </motion.h1>
            </div>

            {/* Main Content - Moved to Bottom Left */}
            <main className="relative z-10 flex flex-col justify-end grow p-8 md:p-20 lg:p-32 pb-24 md:pb-32 lg:pb-40">
                <div className="max-w-4xl space-y-8">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="space-y-4"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-wider">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            Lost in the Grid
                        </div>

                        <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl font-black leading-[0.9] tracking-tighter text-foreground">
                            Off the <br />
                            <span className="text-primary italic inline-flex">
                                <GlitchText speed={0.8} enableShadows={true}>Radar.</GlitchText>
                            </span>
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="text-xl md:text-2xl text-muted-foreground font-medium max-w-xl leading-relaxed"
                    >
                        The profile or production you're looking for has drifted off the radar. Let's get you back on set.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4"
                    >
                        <Magnetic strength={0.2} className="flex">
                            <Link href="/" className="w-full sm:w-auto">
                                <Button
                                    size="xl"
                                    className="w-full sm:w-auto rounded-full px-10 py-8 text-xl font-black bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 shadow-[0_0_30px_rgba(239,68,68,0.4)] border-2 border-transparent group"
                                >
                                    Return to Headquarters
                                    <ChevronRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </Magnetic>

                        <Magnetic strength={0.2} className="flex">
                            <button
                                onClick={() => window.history.back()}
                                className="flex items-center justify-center gap-2 text-lg font-bold text-white/40 hover:text-white transition-colors py-4 px-8 rounded-full border border-white/10 bg-white/5 backdrop-blur-md"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                Step Back
                            </button>
                        </Magnetic>
                    </motion.div>
                </div>
            </main>

            {/* Decorative Floating Elements to match Home feel */}
            <motion.div
                animate={{
                    y: [0, -20, 0],
                    rotate: [0, 5, 0]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 -right-12 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none"
            />
            <motion.div
                animate={{
                    y: [0, 20, 0],
                    rotate: [0, -5, 0]
                }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-12 -left-12 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none"
            />
        </div>
    );
}
