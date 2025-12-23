"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/db/supabase';
import { toast } from 'sonner';
import { RefreshCcw, Mail, Phone, Building2, Calendar, MessageCircle, MoreVertical } from 'lucide-react';

interface Lead {
    id: string;
    name: string;
    email: string;
    phone: string;
    company?: string;
    message?: string;
    status: string;
    created_at: string;
}

export default function LeadsList() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchLeads = useCallback(async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('leads')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setLeads(data || []);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLeads();
    }, [fetchLeads]);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center bg-white/5 p-6 rounded-3xl border border-white/5">
                <div>
                    <h2 className="text-2xl font-heading font-black text-white">Inquiries</h2>
                    <p className="text-white/40 text-sm">Casting director requests and industry leads.</p>
                </div>
                <button
                    onClick={fetchLeads}
                    disabled={isLoading}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all disabled:opacity-50 cursor-target"
                >
                    <RefreshCcw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {leads.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
                        <MessageCircle className="w-12 h-12 text-white/10 mx-auto mb-4" />
                        <p className="text-white/20 italic font-medium">Safe from leads for now.</p>
                    </div>
                ) : (
                    leads.map((lead) => (
                        <div key={lead.id} className="glass p-6 rounded-3xl border border-white/5 space-y-4 hover:border-primary/20 transition-all group">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-white text-lg">{lead.name}</h3>
                                    <p className="text-xs text-primary font-black uppercase tracking-[0.2em]">{lead.status}</p>
                                </div>
                                <button className="text-white/20 hover:text-white transition-colors cursor-target">
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-white/60 text-sm">
                                    <Mail className="w-4 h-4" />
                                    <span className="truncate">{lead.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-white/60 text-sm">
                                    <Phone className="w-4 h-4" />
                                    <span>{lead.phone}</span>
                                </div>
                                {lead.company && (
                                    <div className="flex items-center gap-2 text-white/60 text-sm">
                                        <Building2 className="w-4 h-4" />
                                        <span>{lead.company}</span>
                                    </div>
                                )}
                            </div>

                            {lead.message && (
                                <div className="bg-white/5 p-4 rounded-xl text-sm text-white/40 line-clamp-3 group-hover:line-clamp-none transition-all">
                                    "{lead.message}"
                                </div>
                            )}

                            <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-[10px] text-white/20 font-black uppercase tracking-widest">
                                <Calendar className="w-3 h-3" />
                                {new Date(lead.created_at).toLocaleDateString()}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
