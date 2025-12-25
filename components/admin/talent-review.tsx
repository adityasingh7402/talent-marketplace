"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/db/supabase';
import { toast } from 'sonner';
import { RefreshCcw, CheckCircle, XCircle, ExternalLink, Mail, User, Trash2, Eye, X, MapPin, Calendar, Award, Play, Briefcase, Sparkles, Fingerprint } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Talent {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    status: string;
    created_at: string;
    username?: string;
    profile_image?: string;
    location_city?: string;
    location_state?: string;
    location_country?: string;
    age?: number;
    gender?: string;
    skills?: string[];
    mux_playback_id?: string;
    mux_upload_id?: string;
    headline?: string;
    phone?: string;
    profile_data?: {
        bio?: string;
        experience?: Array<{ project: string; role: string; year: string }>;
        video_url?: string;
    };
}

export default function TalentReview() {
    const [talents, setTalents] = useState<Talent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [filterStatus, setFilterStatus] = useState('pending');
    const [selectedTalent, setSelectedTalent] = useState<Talent | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'experience' | 'skills' | 'account'>('overview');
    const [isSyncingVideo, setIsSyncingVideo] = useState(false);
    const [isPlayingVideo, setIsPlayingVideo] = useState(false);

    const fetchTalents = useCallback(async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('users')
                .select(`
                    id, first_name, last_name, email, role, status, created_at, 
                    username, profile_image, location_city, location_state, location_country, 
                    age, gender, skills, mux_playback_id, mux_upload_id, headline, phone, profile_data
                `)
                .eq('role_category', 'talent')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setTalents(data || []);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTalents();
    }, [fetchTalents]);

    const handleSyncVideo = async (talent: Talent) => {
        if (!talent.mux_upload_id) return;
        setIsSyncingVideo(true);
        try {
            const res = await fetch('/api/admin/sync-mux', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: talent.id, muxUploadId: talent.mux_upload_id })
            });
            const data = await res.json();

            if (data.playbackId) {
                toast.success("Signal Acquired! Playback ID synchronized.");
                setSelectedTalent({ ...talent, mux_playback_id: data.playbackId });
                fetchTalents();
            } else {
                toast.info(`Mux Status: ${data.status || 'Pending'}. Calibration still in progress.`);
            }
        } catch (error) {
            toast.error("Telemetry Sync Failed.");
        } finally {
            setIsSyncingVideo(false);
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            const { error } = await supabase
                .from('users')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;
            toast.success(`User ${newStatus}`);

            // Update local state for modal if open
            if (selectedTalent?.id === id) {
                setSelectedTalent({ ...selectedTalent, status: newStatus });
            }

            fetchTalents();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleDeleteUser = async (id: string) => {
        try {
            const { error } = await supabase
                .from('users')
                .delete()
                .eq('id', id);

            if (error) throw error;
            toast.success('User deleted successfully');
            if (selectedTalent?.id === id) setIsModalOpen(false);
            fetchTalents();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const filteredTalents = talents.filter(talent => {
        const matchesSearch =
            talent.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            talent.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            talent.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (talent.username && talent.username.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesRole = filterRole === 'all' || talent.role === filterRole;
        const matchesStatus = filterStatus === 'all' || talent.status === filterStatus;

        return matchesSearch && matchesRole && matchesStatus;
    });

    const roles = Array.from(new Set(talents.map(t => t.role))).filter(Boolean);
    const statuses = ['pending', 'approved', 'rejected', 'banned'];

    const TabButton = ({ id, label, icon: Icon }: { id: typeof activeTab, label: string, icon: any }) => (
        <button
            onClick={() => {
                setActiveTab(id);
                setIsPlayingVideo(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden group ${activeTab === id
                ? 'bg-primary/10 text-primary shadow-inner shadow-white/5'
                : 'text-white/40 hover:bg-white/5 hover:text-white'
                }`}
        >
            {activeTab === id && (
                <motion.div layoutId="modal-tab-active" className="absolute left-0 w-1 h-5 bg-primary rounded-r-full" />
            )}
            <Icon className={`w-4 h-4 transition-transform ${activeTab === id ? 'scale-110' : 'group-hover:scale-110'}`} />
            <span className="font-bold text-xs uppercase tracking-widest">{label}</span>
        </button>
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-6 bg-zinc-950 p-6 rounded-xl border border-white/5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-heading font-black text-white uppercase tracking-tighter italic">Users Center</h2>
                        <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Infiltrate and verify platform operatives.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Search Operative..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-zinc-900 border border-white/5 rounded-xl px-5 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-primary/30 transition-all w-full md:w-64 pl-12 font-bold"
                            />
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary/50 transition-colors" />
                        </div>
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="bg-zinc-900 border border-white/5 rounded-xl px-5 py-3 text-sm text-white/60 focus:outline-none focus:border-primary/30 transition-all cursor-target font-black uppercase tracking-widest"
                        >
                            <option value="all">All Roles</option>
                            {roles.map(role => (
                                <option key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</option>
                            ))}
                        </select>
                        <button
                            onClick={fetchTalents}
                            disabled={isLoading}
                            className="p-3 rounded-xl bg-white/5 border border-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50 cursor-target group"
                            title="Reload Database"
                        >
                            <RefreshCcw className={`w-5 h-5 ${isLoading ? 'animate-spin text-primary' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-2 p-1.5 bg-zinc-900/50 rounded-xl border border-white/5 w-fit">
                    {['pending', 'approved', 'rejected'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 relative cursor-target ${filterStatus === status
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'text-white/40 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {status}
                            {filterStatus === status && (
                                <motion.div
                                    layoutId="status-glow"
                                    className="absolute inset-0 bg-white/20 blur-xl rounded-xl"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/5 bg-zinc-950" data-lenis-prevent>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/2">
                            <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-white/40">Talent</th>
                            <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-white/40">Details</th>
                            <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-white/40">Skills</th>
                            <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-white/40">Status</th>
                            <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-white/40 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredTalents.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-white/20 italic">No talent found.</td>
                            </tr>
                        ) : (
                            filteredTalents.map((talent) => (
                                <tr key={talent.id} className="group hover:bg-white/2 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {talent.profile_image ? (
                                                <img src={talent.profile_image} alt="" className="w-10 h-10 rounded-xl object-cover border border-white/5" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                    <User className="w-5 h-5" />
                                                </div>
                                            )}
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-bold text-white text-sm">{talent.first_name} {talent.last_name}</p>
                                                </div>
                                                <p className="text-xs text-white/40">@{talent.username || 'unknown'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-black uppercase tracking-widest bg-white/5 text-white/60 px-2 py-0.5 rounded-xl">
                                                {talent.role}
                                            </span>
                                            {(talent.location_city || talent.location_country) && (
                                                <p className="text-[10px] text-white/40">
                                                    {talent.location_city}, {talent.location_country}
                                                </p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                                            {talent.skills && talent.skills.length > 0 ? (
                                                talent.skills.slice(0, 2).map((skill, i) => (
                                                    <span key={i} className="text-[10px] text-white/40 bg-zinc-900 px-1.5 py-0.5 rounded-xl border border-white/5">
                                                        {skill}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-[10px] text-white/20">-</span>
                                            )}
                                            {talent.skills && talent.skills.length > 2 && (
                                                <span className="text-[10px] text-white/20">+{talent.skills.length - 2}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-xl border ${talent.status === 'approved' ? 'bg-green-500/10 border-green-500/20 text-green-500' :
                                            talent.status === 'pending' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                                                'bg-red-500/10 border-red-500/20 text-red-500'
                                            }`}>
                                            {talent.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {talent.status === 'pending' && (
                                                <>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <button
                                                                className="p-2 rounded-xl bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-all cursor-target"
                                                                title="Approve"
                                                            >
                                                                <CheckCircle className="w-4 h-4" />
                                                            </button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent className="bg-zinc-950 border-white/10">
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle className="text-white">Approve Operative?</AlertDialogTitle>
                                                                <AlertDialogDescription className="text-white/40">
                                                                    This will grant the user full access to the talent directory.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel
                                                                    onClick={() => (window as any).__resetTargetCursor?.()}
                                                                    className="bg-white/5 border-white/10 text-white hover:bg-white/10 cursor-target"
                                                                >
                                                                    Cancel
                                                                </AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => {
                                                                        handleStatusUpdate(talent.id, 'approved');
                                                                        (window as any).__resetTargetCursor?.();
                                                                    }}
                                                                    className="bg-green-600 text-white hover:bg-green-500 cursor-target"
                                                                >
                                                                    Confirm Approval
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>

                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <button
                                                                className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all cursor-target"
                                                                title="Reject"
                                                            >
                                                                <XCircle className="w-4 h-4" />
                                                            </button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent className="bg-zinc-950 border-white/10">
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle className="text-white">Reject Profile?</AlertDialogTitle>
                                                                <AlertDialogDescription className="text-white/40">
                                                                    The user will be notified that their profile did not meet the platform requirements.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel
                                                                    onClick={() => (window as any).__resetTargetCursor?.()}
                                                                    className="bg-white/5 border-white/10 text-white hover:bg-white/10 cursor-target"
                                                                >
                                                                    Cancel
                                                                </AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => {
                                                                        handleStatusUpdate(talent.id, 'rejected');
                                                                        (window as any).__resetTargetCursor?.();
                                                                    }}
                                                                    className="bg-red-600 text-white hover:bg-red-500 cursor-target"
                                                                >
                                                                    Confirm Rejection
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </>
                                            )}
                                            <button
                                                onClick={() => {
                                                    setSelectedTalent(talent);
                                                    setActiveTab('overview');
                                                    setIsPlayingVideo(false);
                                                    setIsModalOpen(true);
                                                }}
                                                className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-all cursor-target"
                                                title="View Profile"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <button
                                                        className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all cursor-target"
                                                        title="Delete Profile"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent className="bg-zinc-950 border-white/10">
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle className="text-white">Terminate Operative?</AlertDialogTitle>
                                                        <AlertDialogDescription className="text-white/40">
                                                            Crucial: This action is permanent and will purge all user data from the central database.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel
                                                            onClick={() => (window as any).__resetTargetCursor?.()}
                                                            className="bg-white/5 border-white/10 text-white hover:bg-white/10 cursor-target"
                                                        >
                                                            Cancel
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => {
                                                                handleDeleteUser(talent.id);
                                                                (window as any).__resetTargetCursor?.();
                                                            }}
                                                            className="bg-red-600 text-white hover:bg-red-500 cursor-target"
                                                        >
                                                            Execute Termination
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Profile View Modal */}
            <AnimatePresence>
                {isModalOpen && selectedTalent && (
                    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-5xl bg-zinc-950 border border-white/10 rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[85vh]"
                        >
                            {/* Left Sidebar Navigation */}
                            <div className="w-full md:w-72 bg-zinc-900/50 p-6 flex flex-col border-b md:border-b-0 md:border-r border-white/5 overflow-y-auto custom-scrollbar">
                                <div className="flex flex-col items-center mb-8">
                                    <div className="relative group mb-4">
                                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {selectedTalent.profile_image ? (
                                            <img
                                                src={selectedTalent.profile_image}
                                                alt=""
                                                className="relative w-28 h-28 rounded-xl object-cover border-2 border-white/10 shadow-xl"
                                            />
                                        ) : (
                                            <div className="relative w-28 h-28 rounded-xl bg-zinc-800 flex items-center justify-center border-2 border-white/10 shadow-xl">
                                                <User className="w-12 h-12 text-white/10" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-lg font-black text-white tracking-tight">
                                            {selectedTalent.first_name} {selectedTalent.last_name}
                                        </h3>
                                        <p className="text-primary font-bold text-[10px] uppercase tracking-widest mt-1">@{selectedTalent.username || 'user'}</p>
                                    </div>
                                </div>

                                <nav className="space-y-1 mb-8">
                                    <TabButton id="overview" label="Overview" icon={User} />
                                    <TabButton id="experience" label="Experience" icon={Briefcase} />
                                    <TabButton id="skills" label="Skills & Media" icon={Sparkles} />
                                    <TabButton id="account" label="Account Details" icon={Fingerprint} />
                                </nav>

                                <div className="mt-auto space-y-4 pt-8 border-t border-white/5">
                                    <div className="relative group">
                                        <div className={`absolute inset-0 blur-xl opacity-20 transition-all duration-500 group-hover:opacity-40 ${selectedTalent.status === 'approved' ? 'bg-green-500' :
                                            selectedTalent.status === 'pending' ? 'bg-amber-500' :
                                                'bg-red-500'
                                            }`} />
                                        <div className={`relative text-[10px] font-black uppercase tracking-[0.3em] text-center py-3 rounded-xl border backdrop-blur-md ${selectedTalent.status === 'approved' ? 'bg-green-500/5 border-green-500/20 text-green-500' :
                                            selectedTalent.status === 'pending' ? 'bg-amber-500/5 border-amber-500/20 text-amber-500' :
                                                'bg-red-500/5 border-red-500/20 text-red-500'
                                            }`}>
                                            {selectedTalent.status} Status
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <button
                                                    className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-green-500 hover:bg-green-500/10 hover:border-green-500/30 transition-all duration-300 group/btn cursor-target"
                                                    title="Approve Talent"
                                                >
                                                    <CheckCircle className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Approve</span>
                                                </button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="bg-zinc-950 border-white/10">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle className="text-white">Approve Operative?</AlertDialogTitle>
                                                    <AlertDialogDescription className="text-white/40">
                                                        This will grant the user full access to the talent directory.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel
                                                        onClick={() => (window as any).__resetTargetCursor?.()}
                                                        className="bg-white/5 border-white/10 text-white hover:bg-white/10 cursor-target"
                                                    >
                                                        Cancel
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => {
                                                            handleStatusUpdate(selectedTalent.id, 'approved');
                                                            (window as any).__resetTargetCursor?.();
                                                        }}
                                                        className="bg-green-600 text-white hover:bg-green-500 cursor-target"
                                                    >
                                                        Confirm Approval
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <button
                                                    className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/30 transition-all duration-300 group/btn cursor-target"
                                                    title="Reject Profile"
                                                >
                                                    <XCircle className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Reject</span>
                                                </button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="bg-zinc-950 border-white/10">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle className="text-white">Reject Profile?</AlertDialogTitle>
                                                    <AlertDialogDescription className="text-white/40">
                                                        The user will be notified that their profile did not meet the platform requirements.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel
                                                        onClick={() => (window as any).__resetTargetCursor?.()}
                                                        className="bg-white/5 border-white/10 text-white hover:bg-white/10 cursor-target"
                                                    >
                                                        Cancel
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => {
                                                            handleStatusUpdate(selectedTalent.id, 'rejected');
                                                            (window as any).__resetTargetCursor?.();
                                                        }}
                                                        className="bg-red-600 text-white hover:bg-red-500 cursor-target"
                                                    >
                                                        Confirm Rejection
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <button
                                                    className="col-span-2 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/30 transition-all duration-300 group/btn cursor-target"
                                                    title="Delete Account"
                                                >
                                                    <Trash2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Terminate Account</span>
                                                </button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="bg-zinc-950 border-white/10">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle className="text-white">Terminate Operative?</AlertDialogTitle>
                                                    <AlertDialogDescription className="text-white/40">
                                                        Crucial: This action is permanent and will purge all user data from the central database.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel
                                                        onClick={() => (window as any).__resetTargetCursor?.()}
                                                        className="bg-white/5 border-white/10 text-white hover:bg-white/10 cursor-target"
                                                    >
                                                        Cancel
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => {
                                                            handleDeleteUser(selectedTalent.id);
                                                            (window as any).__resetTargetCursor?.();
                                                        }}
                                                        className="bg-red-600 text-white hover:bg-red-500 cursor-target"
                                                    >
                                                        Execute Termination
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            </div>

                            {/* Main Content Area */}
                            <div className="flex-1 flex flex-col min-w-0">
                                <header className="p-6 md:p-8 flex items-center justify-between border-b border-white/5">
                                    <h4 className="text-sm font-black uppercase tracking-[0.4em] text-white/40">
                                        Profiling <span className="text-primary">System.</span>
                                    </h4>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="p-2 mr-2 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all active:scale-95"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </header>

                                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10">
                                    <AnimatePresence mode="wait">
                                        {activeTab === 'overview' && (
                                            <motion.div
                                                key="overview"
                                                initial={{ opacity: 0, x: 10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                                className="space-y-8"
                                            >
                                                <section>
                                                    <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6">Professional Narrative</h5>
                                                    <div className="space-y-6">
                                                        <div className="p-6 rounded-xl bg-zinc-900 border border-white/5">
                                                            <p className="text-[10px] text-white/20 uppercase font-black mb-2">Headline</p>
                                                            <p className="text-xl font-bold text-white tracking-tight leading-tight italic">
                                                                {selectedTalent.headline || "No headline provided."}
                                                            </p>
                                                        </div>
                                                        <div className="p-6 rounded-xl bg-zinc-900 border border-white/5">
                                                            <p className="text-[10px] text-white/20 uppercase font-black mb-2">Biography</p>
                                                            <p className="text-white/60 leading-relaxed font-medium">
                                                                {selectedTalent.profile_data?.bio || "This user hasn't written their backstory yet."}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </section>

                                                <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="p-6 rounded-xl bg-zinc-900 border border-white/5 flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                                                            <MapPin className="w-5 h-5 text-primary" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] text-white/20 uppercase font-black">Operating Sector</p>
                                                            <p className="text-white font-bold">{selectedTalent.location_city || 'City Unknown'}, {selectedTalent.location_country || 'Global'}</p>
                                                            <p className="text-[10px] text-white/40">{selectedTalent.location_state || ''}</p>
                                                        </div>
                                                    </div>
                                                    <div className="p-6 rounded-xl bg-zinc-900 border border-white/5 flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                                                            <Calendar className="w-5 h-5 text-primary" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] text-white/20 uppercase font-black">Age / Vital Stats</p>
                                                            <p className="text-white font-bold">{selectedTalent.age || 'Unknown'} Years Old</p>
                                                            <p className="text-[10px] text-white/40 capitalize">{selectedTalent.gender || 'Not Specified'}</p>
                                                        </div>
                                                    </div>
                                                </section>
                                            </motion.div>
                                        )}

                                        {activeTab === 'experience' && (
                                            <motion.div
                                                key="experience"
                                                initial={{ opacity: 0, x: 10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="space-y-6"
                                            >
                                                <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6">Career Timeline</h5>
                                                {selectedTalent.profile_data?.experience && selectedTalent.profile_data.experience.length > 0 ? (
                                                    <div className="space-y-4">
                                                        {selectedTalent.profile_data.experience.map((exp, i) => (
                                                            <div key={i} className="p-6 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-between group hover:border-primary/20 transition-all">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-all">
                                                                        <Award className="w-4 h-4" />
                                                                    </div>
                                                                    <div>
                                                                        <h6 className="text-white font-bold">{exp.project || 'Untitled Project'}</h6>
                                                                        <p className="text-[10px] text-white/40 uppercase tracking-widest">{exp.role || 'Contributor'}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="text-right">
                                                                    <span className="text-xs font-black text-primary px-3 py-1 rounded-xl bg-primary/5">{exp.year || '—'}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="py-20 text-center rounded-xl border border-dashed border-white/5">
                                                        <Briefcase className="w-12 h-12 text-white/5 mx-auto mb-4" />
                                                        <p className="text-white/20 italic">No historical records found for this unit.</p>
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}

                                        {activeTab === 'skills' && (
                                            <motion.div
                                                key="skills"
                                                initial={{ opacity: 0, x: 10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="space-y-10"
                                            >
                                                <section>
                                                    <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6">Skill Taxonomy</h5>
                                                    <div className="flex flex-wrap gap-2">
                                                        {selectedTalent.skills && selectedTalent.skills.length > 0 ? (
                                                            selectedTalent.skills.map((skill, i) => (
                                                                <span key={i} className="px-5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white font-bold text-xs uppercase tracking-tight hover:border-primary/50 transition-all cursor-default">
                                                                    {skill}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <p className="text-white/20 italic">No skills registered.</p>
                                                        )}
                                                    </div>
                                                </section>

                                                <section>
                                                    <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6">Media Surveillance</h5>
                                                    {selectedTalent.mux_playback_id ? (
                                                        <div className="aspect-video w-full rounded-xl overflow-hidden bg-zinc-900 border border-white/5 relative group cursor-target">
                                                            {isPlayingVideo ? (
                                                                <div className="w-full h-full relative">
                                                                    <iframe
                                                                        src={`https://stream.mux.com/${selectedTalent.mux_playback_id}.m3u8`}
                                                                        className="w-full h-full relative z-10"
                                                                        style={{ border: 'none', cursor: 'inherit' }}
                                                                        allow="autoplay; fullscreen; encrypted-media"
                                                                        allowFullScreen
                                                                    ></iframe>
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setIsPlayingVideo(false);
                                                                            (window as any).__resetTargetCursor?.();
                                                                        }}
                                                                        className="absolute top-4 right-4 z-50 px-4 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white font-black text-[10px] uppercase tracking-widest hover:bg-red-500 transition-all cursor-target"
                                                                    >
                                                                        Abort Playback
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <img
                                                                        src={`https://image.mux.com/${selectedTalent.mux_playback_id}/thumbnail.jpg`}
                                                                        alt=""
                                                                        className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
                                                                    />
                                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                                        <button
                                                                            onClick={() => {
                                                                                setIsPlayingVideo(true);
                                                                                (window as any).__resetTargetCursor?.();
                                                                            }}
                                                                            className="w-20 h-20 rounded-xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/40 active:scale-90 transition-all cursor-target"
                                                                        >
                                                                            <Play className="w-8 h-8 text-white fill-white ml-1" />
                                                                        </button>
                                                                    </div>
                                                                    <div className="absolute bottom-6 left-6 flex items-center gap-3">
                                                                        <div className="px-4 py-2 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 text-primary text-[10px] font-black uppercase tracking-widest">
                                                                            Transmission Decrypted
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    ) : (selectedTalent.profile_data?.video_url && !selectedTalent.profile_data.video_url.startsWith('blob:')) ? (
                                                        <div className="aspect-video w-full rounded-xl overflow-hidden bg-zinc-900 border border-white/5 relative group">
                                                            <video
                                                                src={selectedTalent.profile_data.video_url}
                                                                controls
                                                                className="w-full h-full object-cover"
                                                            />
                                                            <div className="absolute top-4 right-4 px-3 py-1 rounded-xl bg-black/60 shadow-lg backdrop-blur-md text-[8px] font-bold text-white/40 uppercase tracking-widest">
                                                                Direct Stream
                                                            </div>
                                                        </div>
                                                    ) : selectedTalent.mux_upload_id ? (
                                                        <div className="aspect-video w-full rounded-xl border-2 border-dashed border-primary/20 flex flex-col items-center justify-center text-primary/40 bg-primary/5 space-y-6">
                                                            <div className="flex flex-col items-center">
                                                                <RefreshCcw className={`w-12 h-12 mb-4 ${isSyncingVideo ? 'animate-spin text-primary' : 'text-primary/40'}`} />
                                                                <p className="text-sm font-black uppercase tracking-widest text-primary">Video Processing</p>
                                                                <p className="text-[10px] text-white/20 mt-2">Mux is calibrating the transmission...</p>
                                                            </div>
                                                            <button
                                                                onClick={() => handleSyncVideo(selectedTalent)}
                                                                disabled={isSyncingVideo}
                                                                className="px-6 py-3 rounded-xl bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary/20 transition-all flex items-center gap-3 disabled:opacity-50"
                                                            >
                                                                <Fingerprint className="w-4 h-4" />
                                                                {isSyncingVideo ? 'Syncing Telemetry...' : 'Force Signal Sync'}
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="aspect-video w-full rounded-xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-white/5 bg-zinc-900">
                                                            <Play className="w-16 h-16 mb-4" />
                                                            <p className="text-sm font-black uppercase tracking-widest">No Visual Reel Found</p>
                                                        </div>
                                                    )}
                                                </section>
                                            </motion.div>
                                        )}

                                        {activeTab === 'account' && (
                                            <motion.div
                                                key="account"
                                                initial={{ opacity: 0, x: 10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="space-y-8"
                                            >
                                                <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6">System Metadata</h5>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="p-6 rounded-xl bg-zinc-900 border border-white/5">
                                                        <p className="text-[10px] text-white/20 uppercase font-black mb-1">Global ID</p>
                                                        <p className="text-xs font-mono text-white/60 select-all truncate">{selectedTalent.id}</p>
                                                    </div>
                                                    <div className="p-6 rounded-xl bg-zinc-900 border border-white/5">
                                                        <p className="text-[10px] text-white/20 uppercase font-black mb-1">Registration Date</p>
                                                        <p className="text-white font-bold">{new Date(selectedTalent.created_at).toLocaleDateString()} at {new Date(selectedTalent.created_at).toLocaleTimeString()}</p>
                                                    </div>
                                                    <div className="p-6 rounded-3xl bg-zinc-900 border border-white/5">
                                                        <p className="text-[10px] text-white/20 uppercase font-black mb-1">Primary Email</p>
                                                        <div className="flex items-center gap-2 group cursor-pointer">
                                                            <p className="text-white font-bold">{selectedTalent.email}</p>
                                                            <Mail className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        </div>
                                                    </div>
                                                    <div className="p-6 rounded-3xl bg-zinc-900 border border-white/5">
                                                        <p className="text-[10px] text-white/20 uppercase font-black mb-1">Mobile Contact</p>
                                                        <p className="text-white font-bold">{selectedTalent.phone || 'Not Logged'}</p>
                                                    </div>
                                                </div>

                                                <div className="p-8 rounded-3xl bg-red-500/5 border border-red-500/10 flex items-center justify-between mt-12">
                                                    <div>
                                                        <h6 className="text-red-500 font-bold mb-1">Platform Control</h6>
                                                        <p className="text-xs text-white/30">Total purge of this user's data from the talent grid.</p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDeleteUser(selectedTalent.id)}
                                                        className="px-6 py-3 rounded-2xl bg-red-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-red-500 transition-all active:scale-95 shadow-xl shadow-red-500/20"
                                                    >
                                                        Delete unit
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
