"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star, ArrowRight, Github, Mail, Lock, User, ChevronRight, ChevronLeft, Loader2 } from "lucide-react";
import BlobBackground from "@/components/blob-background";
import Magnetic from "@/components/magnetic";
import GlitchText from "@/components/glitch-text";
import { toast } from "sonner";

export default function SignupPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Signup failed");
                throw new Error(data.message || "Signup failed");
            }

            toast.success("Account created! Welcome to the Grid.");

            // Success! Redirect to a "Wait for Approval" page or Dashboard
            router.push("/dashboard");
        } catch (err: any) {
            if (err.message !== "Signup failed") {
                toast.error(err.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center bg-background overflow-hidden selection:bg-primary/20">
            {/* Background Blobs */}
            <div className="absolute inset-0 z-0">
                <BlobBackground />
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" />
            </div>

            {/* Noise Texture */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.05] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            {/* Back Button */}
            <div className="absolute top-6 left-6 md:top-10 md:left-10 z-50">
                <Link href="/" className="group flex items-center gap-2 text-white/40 hover:text-white transition-colors py-2">
                    <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/10 transition-all">
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline-block">Back to Home</span>
                </Link>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 w-full max-w-xl p-8"
            >
                <div className="flex flex-col items-center mb-10 text-center">
                    <h1 className="font-heading text-4xl md:text-5xl font-black tracking-tighter text-white mb-2">
                        Join the <span className="text-primary italic"><GlitchText speed={0.5}>Grid.</GlitchText></span>
                    </h1>
                    <p className="text-white/60 font-medium">Create your elite talent profile today.</p>
                </div>

                <div className="glass p-8 rounded-[2.5rem] border border-white/10 shadow-3xl">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName" className="text-xs font-bold uppercase tracking-widest text-white/50 ml-1">First Name</Label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                    <Input
                                        id="firstName"
                                        name="firstName"
                                        placeholder="John"
                                        required
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="h-14 bg-white/5 border-white/10 rounded-2xl pl-12 focus:border-primary/50 focus:ring-primary/20 text-white placeholder:text-white/20 transition-all font-medium"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName" className="text-xs font-bold uppercase tracking-widest text-white/50 ml-1">Last Name</Label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                    <Input
                                        id="lastName"
                                        name="lastName"
                                        placeholder="Doe"
                                        required
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="h-14 bg-white/5 border-white/10 rounded-2xl pl-12 focus:border-primary/50 focus:ring-primary/20 text-white placeholder:text-white/20 transition-all font-medium"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-white/50 ml-1">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="h-14 bg-white/5 border-white/10 rounded-2xl pl-12 focus:border-primary/50 focus:ring-primary/20 text-white placeholder:text-white/20 transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-white/50 ml-1">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="h-14 bg-white/5 border-white/10 rounded-2xl pl-12 focus:border-primary/50 focus:ring-primary/20 text-white placeholder:text-white/20 transition-all font-medium"
                                />
                            </div>
                        </div>

                        {/* Error display removed - using toasts now */}

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-16 rounded-2xl bg-primary text-primary-foreground text-lg font-black hover:bg-primary/90 shadow-lg shadow-primary/20 group transition-all"
                        >
                            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                <>
                                    Create Account
                                    <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-white/10 text-center">
                        <p className="text-white/40 font-medium text-sm">
                            Already have an account?{" "}
                            <Link href="/login" className="text-primary hover:underline font-bold transition-all ml-1">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Decorative elements */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary rounded-full blur-[100px] pointer-events-none"
                />
            </motion.div>
        </div>
    );
}
