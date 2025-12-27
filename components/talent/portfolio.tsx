"use client";

import React, { useState, useEffect } from 'react';
import { Film, Image as ImageIcon, Plus, Play, MoreVertical, Clock, CheckCircle, AlertCircle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/db/supabase';
import CreatePostModal from './create-post-modal';
import PostDetailModal from './post-detail-modal';

export default function Portfolio({ user }: { user: any }) {
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [userPosts, setUserPosts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState<any>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const fetchPosts = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (data) setUserPosts(data);
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user?.id) fetchPosts();
    }, [user?.id]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
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
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            {/* Reels Section */}
            <section className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
                    <div className="space-y-1">
                        <h3 className="text-xl md:text-2xl font-heading font-black text-white">Performance Reels</h3>
                        <p className="text-white/40 text-[13px] md:text-sm">Showcase your best moments on screen.</p>
                    </div>
                    <Button
                        onClick={() => setIsPostModalOpen(true)}
                        className="rounded-xl bg-primary hover:bg-primary/90 font-bold gap-2 cursor-target w-fit px-3 py-5 sm:py-2 text-[10px] sm:text-xs uppercase tracking-widest sm:normal-case sm:tracking-normal"
                    >
                        <Plus className="w-4 h-4" /> UPLOAD
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Add New Card */}
                    <div
                        onClick={() => setIsPostModalOpen(true)}
                        className="aspect-video rounded-xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-center p-6 md:p-8 hover:border-primary/40 hover:bg-zinc-900 transition-all group cursor-target cursor-pointer min-h-[160px]"
                    >
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-white/5 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <Film className="w-5 h-5 md:w-6 md:h-6 text-white/20" />
                        </div>
                        <p className="text-white font-bold text-xs md:text-sm">Add New Reel</p>
                    </div>

                    {/* Fetched Posts */}
                    {userPosts.map((post) => (
                        <div
                            key={post.id}
                            onClick={() => {
                                setSelectedPost(post);
                                setIsDetailModalOpen(true);
                            }}
                            className="aspect-video rounded-xl bg-zinc-900 border border-white/10 overflow-hidden relative group cursor-target shadow-2xl shadow-black/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {/* Thumbnail or Placeholder */}
                            <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center">
                                {post.media_urls?.[0] ? (
                                    <img
                                        src={post.media_urls[0]}
                                        alt={post.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : post.status === 'approved' && post.mux_playback_id ? (
                                    <video
                                        src={`https://stream.mux.com/${post.mux_playback_id}/low.mp4`}
                                        className="w-full h-full object-cover opacity-60"
                                    />
                                ) : (
                                    <Film className="w-12 h-12 text-white/5" />
                                )}
                            </div>

                            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                            {/* View Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                                <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                    {post.media_type === 'image' ? (
                                        <ImageIcon className="w-3 h-3" />
                                    ) : (
                                        <Play className="w-3 h-3 fill-white" />
                                    )}
                                    View Piece
                                </div>
                            </div>

                            <div className="absolute top-4 right-4 flex gap-2 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                                <div className="px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white/40 text-[9px] font-bold flex items-center gap-1">
                                    <Calendar className="w-2.5 h-2.5" /> {formatDate(post.created_at)}
                                </div>
                                <button className="p-1 px-2 rounded-lg bg-black/80 border border-white/10 text-white/60 hover:text-white">
                                    <MoreVertical className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            <div className="absolute bottom-4 left-6 right-6">
                                <p className="font-bold text-white text-lg truncate mb-1">{post.title}</p>
                                <StatusBadge status={post.status} />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Create Post Modal */}
            <CreatePostModal
                userId={user.id}
                isOpen={isPostModalOpen}
                onClose={() => setIsPostModalOpen(false)}
                onSuccess={fetchPosts}
            />

            <PostDetailModal
                post={selectedPost}
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
            />
        </div>
    );
}
