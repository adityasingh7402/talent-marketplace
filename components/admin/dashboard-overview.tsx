"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { Users, Clock, MessageSquare, RefreshCcw, TrendingUp, ShieldCheck, Activity } from 'lucide-react';
import MagicBento from '@/components/magic-bento';
import { toast } from 'sonner';

interface Stats {
    totalUsers: number;
    pendingUsers: number;
    totalLeads: number;
}

export default function DashboardOverview() {
    const [stats, setStats] = useState<Stats>({
        totalUsers: 0,
        pendingUsers: 0,
        totalLeads: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    const fetchStats = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/stats');
            if (!res.ok) throw new Error('Failed to fetch statistics');
            const data = await res.json();
            setStats(data);
            toast.success('Stats updated');
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const cards = [
        {
            title: stats.pendingUsers.toString(),
            description: "Talent waiting for verification to join the grid.",
            label: "Pending Approvals",
            icon: <Clock className="w-6 h-6" />,
            color: "rgba(251, 191, 36, 0.05)", // Amber/Yellow
        },
        {
            title: stats.totalUsers.toString(),
            description: "Total creative professionals registered in our directory.",
            label: "Total Talent",
            icon: <Users className="w-6 h-6" />,
            color: "rgba(34, 197, 94, 0.05)", // Green
        },
        {
            title: stats.totalLeads.toString(),
            description: "Active casting inquiries and contact requests from industry pros.",
            label: "Active Leads",
            icon: <MessageSquare className="w-6 h-6" />,
            color: "rgba(59, 130, 246, 0.05)", // Blue
        },
        {
            title: "Growth Metrics",
            description: "User registration trends over the last 30 days.",
            label: "Analytics",
            icon: <TrendingUp className="w-6 h-6" />,
            color: "rgba(139, 92, 246, 0.05)", // Purple
        },
        {
            title: "Security Status",
            description: "Platform-wide security systems are operational.",
            label: "System",
            icon: <ShieldCheck className="w-6 h-6" />,
            color: "rgba(239, 68, 68, 0.05)", // Red
        },
        {
            title: "Recent Activity",
            description: "Live feed of user registrations and approvals.",
            label: "Live Feed",
            icon: <Activity className="w-6 h-6" />,
            color: "rgba(236, 72, 153, 0.05)", // Pink
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-heading font-black text-white">Grid Overview</h2>
                    <p className="text-white/40 text-sm">Real-time platform metrics and analysis.</p>
                </div>
                <button
                    onClick={fetchStats}
                    disabled={isLoading}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all active:scale-95 disabled:opacity-50 cursor-target"
                >
                    <RefreshCcw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="h-[600px] w-full">
                <MagicBento
                    cards={cards}
                    enableTilt={true}
                    enableStars={true}
                    glowColor="239, 68, 68" // Match primary red/orange
                />
            </div>
        </div>
    );
}
