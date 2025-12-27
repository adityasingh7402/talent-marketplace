"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Film, Image as ImageIcon, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/db/supabase';
import { toast } from 'sonner';

interface CreatePostModalProps {
    userId: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

type MediaType = 'video' | 'image';

export default function CreatePostModal({ userId, isOpen, onClose, onSuccess }: CreatePostModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [mediaType, setMediaType] = useState<MediaType>('video');

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string>('');

    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoUrl, setVideoUrl] = useState<string>('');

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImageUrl(URL.createObjectURL(file));
        }
    };

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 50 * 1024 * 1024) {
                toast.error("Video file is too large (max 50MB)");
                return;
            }
            setVideoFile(file);
            setVideoUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            toast.error("Please provide a title");
            return;
        }

        if (mediaType === 'image' && !imageFile) {
            toast.error("Please upload an image");
            return;
        }
        if (mediaType === 'video' && !videoFile) {
            toast.error("Please upload a video");
            return;
        }

        setIsSubmitting(true);
        try {
            let finalImageUrl = '';
            let muxUploadId = null;
            let muxAssetId = null;

            // 1. Upload Image if needed
            if (mediaType === 'image' && imageFile) {
                toast.info("Uploading image...");
                const signRes = await fetch('/api/upload/cloudinary-sign', {
                    method: 'POST',
                    body: JSON.stringify({ folder: 'talent_posts' })
                });
                const signData = await signRes.json();

                if (signData.signature) {
                    const formDataUpload = new FormData();
                    formDataUpload.append('file', imageFile);
                    formDataUpload.append('api_key', signData.apiKey);
                    formDataUpload.append('timestamp', signData.timestamp.toString());
                    formDataUpload.append('signature', signData.signature);
                    formDataUpload.append('folder', 'talent_posts');

                    const response = await fetch(`https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`, {
                        method: 'POST',
                        body: formDataUpload
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(`Cloudinary upload failed: ${data.error?.message || response.statusText}`);
                    }

                    if (data.secure_url) {
                        finalImageUrl = data.secure_url;
                    }
                }
            }

            // 2. Upload Video if needed
            if (mediaType === 'video' && videoFile) {
                toast.info("Initializing video upload...");
                const muxRes = await fetch('/api/upload/mux', { method: 'POST' });
                const muxData = await muxRes.json();

                if (muxData.uploadUrl) {
                    toast.info("Uploading video...");
                    const response = await fetch(muxData.uploadUrl, {
                        method: 'PUT',
                        body: videoFile,
                        headers: { 'Content-Type': videoFile.type }
                    });

                    if (!response.ok) {
                        throw new Error("Video upload to Mux failed");
                    }

                    muxUploadId = muxData.uploadId;
                }
            }

            // 3. Save to Supabase
            const { error } = await supabase
                .from('posts')
                .insert({
                    user_id: userId,
                    title,
                    description,
                    media_type: mediaType,
                    media_urls: finalImageUrl ? [finalImageUrl] : [],
                    mux_upload_id: muxUploadId,
                    status: 'pending'
                });

            if (error) throw error;

            toast.success("Post submitted for approval!");
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error("Submission error:", error);
            toast.error(error.message || "Failed to create post");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />

            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="relative w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-xl overflow-hidden shadow-2xl"
            >
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-heading font-black text-white">Share Your Craft</h2>
                        <p className="text-white/40 text-sm">Upload your latest work for verification.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {/* Title */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary">Post Title</label>
                        <input
                            type="text"
                            placeholder="e.g. Dramatic Monologue - Hamlet"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white outline-none focus:border-primary/50 transition-all font-bold"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Short Description</label>
                        <textarea
                            placeholder="Tell us a bit about this piece..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white outline-none focus:border-primary/50 transition-all resize-none font-medium"
                        />
                    </div>

                    {/* Media Type Selection */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Media Format</label>
                        <div className="grid grid-cols-2 gap-2">
                            {(['video', 'image'] as MediaType[]).map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setMediaType(type)}
                                    className={`px-4 py-3 rounded-xl border transition-all font-bold text-[10px] uppercase tracking-widest ${mediaType === type
                                        ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                                        : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Upload Areas */}
                    <div className="grid grid-cols-1 gap-4">
                        {mediaType === 'image' && (
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Image content</label>
                                <label className="relative group cursor-target block">
                                    <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                                    <div className="aspect-video rounded-xl border-2 border-dashed border-white/10 group-hover:border-primary/50 transition-all flex flex-col items-center justify-center overflow-hidden bg-white/5">
                                        {imageUrl ? (
                                            <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 text-white/20 group-hover:text-primary/50 transition-colors">
                                                <ImageIcon className="w-8 h-8" />
                                                <span className="text-[8px] font-black uppercase tracking-tighter">Upload Image</span>
                                            </div>
                                        )}
                                    </div>
                                </label>
                            </div>
                        )}

                        {mediaType === 'video' && (
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Video Content</label>
                                <label className="relative group cursor-target block">
                                    <input type="file" className="hidden" onChange={handleVideoChange} accept="video/*" />
                                    <div className="aspect-video rounded-xl border-2 border-dashed border-white/10 group-hover:border-primary/50 transition-all flex flex-col items-center justify-center overflow-hidden bg-white/5">
                                        {videoFile ? (
                                            <div className="flex flex-col items-center gap-2 text-primary">
                                                <CheckCircle2 className="w-8 h-8" />
                                                <span className="text-[8px] font-black uppercase tracking-tighter truncate max-w-[150px]">{videoFile.name}</span>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 text-white/20 group-hover:text-primary/50 transition-colors">
                                                <Film className="w-8 h-8" />
                                                <span className="text-[8px] font-black uppercase tracking-tighter">Upload Video</span>
                                            </div>
                                        )}
                                    </div>
                                </label>
                            </div>
                        )}
                    </div>

                    <div className="pt-4">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-14 rounded-xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest shadow-2xl shadow-primary/20 disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Transmitting...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    Submit for Calibration <Sparkles className="w-4 h-4 fill-white" />
                                </div>
                            )}
                        </Button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
