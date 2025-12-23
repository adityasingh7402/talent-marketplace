"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    User, Mail, Phone, MapPin, Calendar,
    Star, Edit, LogOut, Camera, Award, Briefcase
} from "lucide-react";
import { toast } from "sonner";

interface UserProfile {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    role: string;
    role_category: string;
    status: string;
    profile_image?: string;
    location_city?: string;
    location_state?: string;
    location_country?: string;
    age?: number;
    profile_views?: number;
    contact_requests?: number;
    created_at: string;
}

export default function ProfileClient({ userId }: { userId: string }) {
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(`/api/profile?userId=${userId}`);
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || 'Failed to fetch profile');
                }

                setProfile(data.user);
            } catch (error: any) {
                toast.error(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [userId]);

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/login");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <p className="text-white/60">Profile not found</p>
            </div>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return 'text-green-500 bg-green-500/10 border-green-500/20';
            case 'pending': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
            case 'rejected': return 'text-red-500 bg-red-500/10 border-red-500/20';
            default: return 'text-white/40 bg-white/5 border-white/10';
        }
    };

    const formatRole = (role: string) => {
        return role.split('_').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-white/10 bg-card/30 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <Star className="text-white w-5 h-5 fill-white" />
                        </div>
                        <span className="font-heading font-bold text-xl tracking-tight text-white">TalentGrid.</span>
                    </div>
                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="text-white/60 hover:text-white transition-colors"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                    </Button>
                </div>
            </header>

            <div className="container mx-auto px-4 py-12 max-w-5xl">
                {/* Profile Header Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="glass p-8 rounded-3xl border border-white/10 mb-6">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                            {/* Profile Image */}
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/30 flex items-center justify-center overflow-hidden">
                                    {profile.profile_image ? (
                                        <img
                                            src={profile.profile_image}
                                            alt={`${profile.first_name} ${profile.last_name}`}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <User className="w-16 h-16 text-primary/40" />
                                    )}
                                </div>
                                <button className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                                    <Camera className="w-4 h-4 text-white" />
                                </button>
                            </div>

                            {/* Profile Info */}
                            <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h1 className="text-3xl font-heading font-black text-white mb-1">
                                            {profile.first_name} {profile.last_name}
                                        </h1>
                                        <p className="text-white/60 font-medium">
                                            {formatRole(profile.role)}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-widest ${getStatusColor(profile.status)}`}>
                                        {profile.status}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-4 mt-4">
                                    <div className="flex items-center gap-2 text-white/60">
                                        <Mail className="w-4 h-4" />
                                        <span className="text-sm">{profile.email}</span>
                                    </div>
                                    {profile.phone && (
                                        <div className="flex items-center gap-2 text-white/60">
                                            <Phone className="w-4 h-4" />
                                            <span className="text-sm">{profile.phone}</span>
                                        </div>
                                    )}
                                    {(profile.location_city || profile.location_state) && (
                                        <div className="flex items-center gap-2 text-white/60">
                                            <MapPin className="w-4 h-4" />
                                            <span className="text-sm">
                                                {profile.location_city}{profile.location_city && profile.location_state && ', '}{profile.location_state}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Edit Button */}
                            <Button
                                className="bg-primary hover:bg-primary/90 text-white rounded-xl px-6"
                                onClick={() => router.push('/profile/edit')}
                            >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Profile
                            </Button>
                        </div>
                    </Card>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
                >
                    <Card className="glass p-6 rounded-2xl border border-white/10">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Award className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Profile Views</p>
                                <p className="text-2xl font-heading font-black text-white">{profile.profile_views || 0}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="glass p-6 rounded-2xl border border-white/10">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Briefcase className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Contact Requests</p>
                                <p className="text-2xl font-heading font-black text-white">{profile.contact_requests || 0}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="glass p-6 rounded-2xl border border-white/10">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Member Since</p>
                                <p className="text-2xl font-heading font-black text-white">
                                    {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                </p>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Profile Completion Notice */}
                {profile.status === 'approved' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Card className="glass p-6 rounded-2xl border border-primary/20 bg-primary/5">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                                    <Star className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold mb-1">Complete Your Profile</h3>
                                    <p className="text-white/60 text-sm mb-3">
                                        Add more details to your profile to increase your visibility and get more casting opportunities.
                                    </p>
                                    <Button
                                        className="bg-primary hover:bg-primary/90 text-white rounded-xl"
                                        onClick={() => router.push('/profile/edit')}
                                    >
                                        Complete Profile
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
