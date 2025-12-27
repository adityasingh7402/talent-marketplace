"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Play, Clock, CheckCircle, AlertCircle, Film, Image as ImageIcon } from 'lucide-react';

interface PostDetailModalProps {
    post: any;
    isOpen: boolean;
    onClose: () => void;
}

export default function PostDetailModal({ post, isOpen, onClose }: PostDetailModalProps) {
    if (!post || !isOpen) return null;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const StatusBadge = ({ status }: { status: string }) => {
        switch (status) {
            case 'approved':
                return (
                    <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                        <CheckCircle className="w-3 h-3" /> Approved
                    </div>
                );
            case 'rejected':
                return (
                    <div className="flex items-center gap-1.5 text-red-500 text-[10px] font-black uppercase tracking-widest">
                        <AlertCircle className="w-3 h-3" /> Rejected
                    </div>
                );
            default:
                return (
                    <div className="flex items-center gap-1.5 text-amber-500 text-[10px] font-black uppercase tracking-widest">
                        <Clock className="w-3 h-3 animate-pulse" /> Pending Review
                    </div>
                );
        }
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/95 backdrop-blur-sm"
            />

            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="relative w-full max-w-4xl bg-zinc-950 border border-white/10 rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
            >
                {/* Close Button Mobile */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 p-2 rounded-xl bg-black/50 border border-white/10 text-white md:hidden"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Media Container */}
                <div className="w-full md:w-[60%] bg-black flex items-center justify-center relative aspect-video md:aspect-auto min-h-[300px]">
                    {post.media_type === 'image' ? (
                        <img
                            src={post.media_urls?.[0]}
                            alt={post.title}
                            className="w-full h-full object-contain"
                        />
                    ) : (
                        <div className="w-full h-full relative group flex items-center justify-center">
                            {post.status === 'approved' && post.mux_playback_id ? (
                                <video
                                    src={`https://stream.mux.com/${post.mux_playback_id}/high.mp4`}
                                    controls
                                    autoPlay
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-white/20 gap-4">
                                    <div className="w-20 h-20 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center">
                                        <Film className="w-10 h-10" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] font-black uppercase tracking-widest">Video processing</p>
                                        <p className="text-[8px] text-white/10 uppercase tracking-tighter">Stay tuned for the premiere</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Content Container */}
                <div className="w-full md:w-[40%] p-8 overflow-y-auto flex flex-col">
                    <div className="items-center justify-between mb-8 hidden md:flex">
                        <StatusBadge status={post.status} />
                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
                                <Calendar className="w-3 h-3" />
                                {formatDate(post.created_at)}
                            </div>
                            <h2 className="text-3xl font-heading font-black text-white leading-tight">{post.title}</h2>
                        </div>

                        {post.description && (
                            <div className="space-y-2">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40">Description</h3>
                                <p className="text-white/60 text-sm leading-relaxed font-medium">
                                    {post.description}
                                </p>
                            </div>
                        )}

                        <div className="pt-6 border-t border-white/5 flex flex-wrap gap-2">
                            <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                                {post.media_type === 'video' ? <Film className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                                {post.media_type}
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto pt-8">
                        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                <CheckCircle className="w-5 h-5" />
                            </div>
                            <div className="text-[10px] font-bold text-white/60 leading-tight uppercase tracking-wide">
                                This post is visible to industry leaders once approved.
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
