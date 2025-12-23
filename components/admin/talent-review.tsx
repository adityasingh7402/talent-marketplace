"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/db/supabase';
import { toast } from 'sonner';
import { RefreshCcw, CheckCircle, XCircle, ExternalLink, Mail, User } from 'lucide-react';

interface Talent {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    status: string;
    created_at: string;
}

export default function TalentReview() {
    const [talents, setTalents] = useState<Talent[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTalents = useCallback(async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('users')
                .select('id, first_name, last_name, email, role, status, created_at')
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

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            const { error } = await supabase
                .from('users')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;
            toast.success(`User ${newStatus}`);
            fetchTalents();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center bg-white/5 p-6 rounded-3xl border border-white/5">
                <div>
                    <h2 className="text-2xl font-heading font-black text-white">Talent Review</h2>
                    <p className="text-white/40 text-sm">Review and approve new talent registrations.</p>
                </div>
                <button
                    onClick={fetchTalents}
                    disabled={isLoading}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all disabled:opacity-50 cursor-target"
                >
                    <RefreshCcw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/5 bg-zinc-950/30 backdrop-blur-xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/5">
                            <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-white/40">Talent</th>
                            <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-white/40">Role</th>
                            <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-white/40">Status</th>
                            <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-white/40 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {talents.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-white/20 italic">No talent found.</td>
                            </tr>
                        ) : (
                            talents.map((talent) => (
                                <tr key={talent.id} className="group hover:bg-white/2 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-white text-sm">{talent.first_name} {talent.last_name}</p>
                                                <p className="text-xs text-white/40 flex items-center gap-1">
                                                    <Mail className="w-3 h-3" /> {talent.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-bold text-white/60 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-md">
                                            {talent.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full border ${talent.status === 'approved' ? 'bg-green-500/10 border-green-500/20 text-green-500' :
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
                                                    <button
                                                        onClick={() => handleStatusUpdate(talent.id, 'approved')}
                                                        className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-all cursor-target"
                                                        title="Approve"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(talent.id, 'rejected')}
                                                        className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all cursor-target"
                                                        title="Reject"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                            <button className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all cursor-target">
                                                <ExternalLink className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
