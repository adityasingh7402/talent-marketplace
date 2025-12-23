"use client";

import React from 'react';
import { Film, Image as ImageIcon, Plus, Play, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Portfolio() {
    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Reels Section */}
            <section className="space-y-6">
                <div className="flex justify-between items-end">
                    <div>
                        <h3 className="text-2xl font-heading font-black text-white">Performance Reels</h3>
                        <p className="text-white/40 text-sm">Showcase your best moments on screen.</p>
                    </div>
                    <Button className="rounded-xl bg-primary hover:bg-primary/90 font-bold gap-2 cursor-target">
                        <Plus className="w-4 h-4" /> Upload Reel
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Add New Card */}
                    <div className="aspect-video rounded-3xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-center p-8 hover:border-primary/40 hover:bg-primary/5 transition-all group cursor-target">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <Film className="w-6 h-6 text-white/20" />
                        </div>
                        <p className="text-white font-bold text-sm">Add New Reel</p>
                    </div>

                    {/* Example Reel Item */}
                    <div className="aspect-video rounded-3xl bg-white/5 border border-white/10 overflow-hidden relative group cursor-target shadow-2xl shadow-black/50">
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm">
                            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center scale-75 group-hover:scale-100 transition-transform">
                                <Play className="w-6 h-6 text-white fill-white ml-1" />
                            </div>
                        </div>
                        <div className="absolute top-4 right-4 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                            <button className="p-2 rounded-xl bg-black/50 backdrop-blur-md border border-white/10 text-white/60 hover:text-white">
                                <MoreVertical className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="absolute bottom-4 left-6">
                            <p className="font-bold text-white">Dramatic Monologue 2024</p>
                            <p className="text-[10px] text-white/40 uppercase tracking-widest font-black">2:45 • Approved</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <section className="space-y-6">
                <div className="flex justify-between items-end">
                    <div>
                        <h3 className="text-2xl font-heading font-black text-white">Headshots & Stills</h3>
                        <p className="text-white/40 text-sm">Professional imagery for your profile.</p>
                    </div>
                    <Button variant="outline" className="rounded-xl border-white/10 hover:bg-white/5 font-bold gap-2 cursor-target text-white">
                        <Plus className="w-4 h-4" /> Add Image
                    </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    <div className="aspect-square rounded-2xl border-2 border-dashed border-white/5 flex items-center justify-center group hover:border-primary/40 hover:bg-primary/5 transition-all cursor-target">
                        <ImageIcon className="w-6 h-6 text-white/10 group-hover:text-primary/40 transition-colors" />
                    </div>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="aspect-square rounded-2xl bg-white/5 border border-white/10 overflow-hidden relative group cursor-target">
                            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-1.5 rounded-lg bg-black/50 backdrop-blur-md border border-white/10 text-white/60 hover:text-white">
                                    <MoreVertical className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
