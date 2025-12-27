"use client";

import React from 'react';
import { Settings, Shield, Bell, CreditCard, ChevronRight } from 'lucide-react';

export default function TalentSettings() {
    const sections = [
        {
            title: "Account Security",
            description: "Manage your password and security settings.",
            icon: <Shield className="w-5 h-5 text-blue-500" />,
            items: ["Change Password", "Two-Factor Authentication", "Login History"]
        },
        {
            title: "Notifications",
            description: "Control how you receive alerts and updates.",
            icon: <Bell className="w-5 h-5 text-amber-500" />,
            items: ["Email Notifications", "Push Notifications", "In-App Alerts"]
        },
        {
            title: "Privacy",
            description: "Manage your profile visibility and data.",
            icon: <Settings className="w-5 h-5 text-purple-500" />,
            items: ["Profile Visibility", "Data Export", "Delete Account"]
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 gap-6">
                {sections.map((section, idx) => (
                    <div key={idx} className="bg-zinc-900 border border-white/10 rounded-xl p-6 hover:bg-zinc-800 transition-all group overflow-hidden relative">
                        <div className="flex items-start justify-between">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-xl bg-black/20 flex items-center justify-center shrink-0">
                                    {section.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1">{section.title}</h3>
                                    <p className="text-white/40 text-sm mb-6">{section.description}</p>

                                    <div className="space-y-3">
                                        {section.items.map((item, i) => (
                                            <button key={i} className="flex items-center justify-between w-full p-4 rounded-xl bg-black/20 border border-white/5 hover:border-white/10 hover:bg-black/30 transition-all text-white/60 hover:text-white text-sm font-bold group/item cursor-target">
                                                {item}
                                                <ChevronRight className="w-4 h-4 group-hover/item:translate-x-1 transition-transform" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
