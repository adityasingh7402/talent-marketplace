"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Stepper, { Step } from '@/components/ui/stepper';
import { supabase } from '@/lib/db/supabase';
import { toast } from 'sonner';
import {
    Camera, MapPin, Briefcase, User, Sparkles,
    Calendar, Venus, Mars, Fingerprint, AtSign, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const SKILL_MAP: Record<string, string[]> = {
    'Actor': ['Action', 'Comedy', 'Drama', 'Method Acting', 'Stunt Work', 'Voice Over', 'Musical Theatre', 'Screen Acting'],
    'Singer': ['Soprano', 'Jazz', 'Pop', 'Rock', 'Opera', 'Songwriting', 'Vocal Coaching', 'R&B'],
    'Dancer': ['Contemporary', 'Ballet', 'Hip Hop', 'Tap', 'Jazz Dance', 'Choreography', 'Ballroom'],
    'Model': ['Runway', 'Editorial', 'Commercial', 'Fitness', 'Hand Model', 'Fit Model'],
    'Voice Artist': ['Narration', 'Animation', 'Gaming', 'Commercial', 'Audiobooks', 'IVR'],
    'Stunt Performer': ['Combat', 'Driving', 'Fire Stunts', 'High Falls', 'Wire Work', 'Weaponry'],
    'Writer': ['Screenwriting', 'Playwriting', 'Poetry', 'Copywriting', 'Ghostwriting', 'Editing'],
    'Director': ['Feature Film', 'Short Film', 'Music Video', 'Commercial', 'Documentary', 'Theater']
};

const ROLE_IMAGES: Record<string, string> = {
    'Actor': '/images/roles/actor.png',
    'Singer': '/images/roles/singer.png',
    'Dancer': '/images/roles/dancer.png',
    'Model': '/images/roles/model.png',
    'Voice Artist': '/images/roles/voice_artist.png',
    'Stunt Performer': '/images/roles/stunt_performer.png',
    'Writer': '/images/roles/writer.png',
    'Director': '/images/roles/director.png'
};

interface OnboardingModalProps {
    user: any;
    onComplete: () => void;
}

const calculateAge = (dob: string): number | null => {
    if (!dob) return null;
    const birthday = new Date(dob);
    const ageDifMs = Date.now() - birthday.getTime();
    const ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
};

export default function OnboardingModal({ user, onComplete }: OnboardingModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showVideoUpload, setShowVideoUpload] = useState(false);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [usernameError, setUsernameError] = useState<string | null>(null);
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        username: '',
        headline: '',
        bio: '',
        dob: '',
        gender: '',
        category: user?.role === 'unknown' ? '' : (user?.role || 'actor'),
        tags: [] as string[],
        city: '',
        state: '',
        country: '',
        lat: null as number | null,
        lng: null as number | null,
        experience: [{ project: '', role: '', year: '' }],
        profile_image: null as File | null,
        profile_image_url: user?.profile_image || '',
        video_url: '',
        selectedCategory: (user?.role && user.role !== 'unknown' ? user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase() : '') as string
    });

    useEffect(() => {
        const timer = setTimeout(() => setIsOpen(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    const handleLocationDetect = async () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation not supported by your browser");
            return;
        }

        toast.info("Detecting your sector...");
        navigator.geolocation.getCurrentPosition(async (pos) => {
            const { latitude, longitude } = pos.coords;
            setFormData(prev => ({ ...prev, lat: latitude, lng: longitude }));

            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
                const data = await res.json();

                if (data.address) {
                    setFormData(prev => ({
                        ...prev,
                        city: data.address.city || data.address.town || data.address.suburb || '',
                        state: data.address.state || '',
                        country: data.address.country || ''
                    }));
                    toast.success(`Located: ${data.address.city || data.address.country}`);
                }
            } catch (error) {
                toast.error("Failed to fetch address details");
            }
        });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                profile_image: file,
                profile_image_url: URL.createObjectURL(file)
            }));
        }
    };

    const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                toast.error("File size must be less than 10MB");
                return;
            }
            // Basic client-side check for video duration isn't robust without loading it into a video element,
            // but we can enforce file type and size here.

            setVideoFile(file);
            setFormData(prev => ({
                ...prev,
                video_url: URL.createObjectURL(file)
            }));
            toast.success("Video attached successfully");
        }
    };

    const addExperience = () => {
        setFormData(prev => ({
            ...prev,
            experience: [...prev.experience, { project: '', role: '', year: '' }]
        }));
    };

    const updateExperience = (index: number, field: string, value: string) => {
        const newExp = [...formData.experience];
        newExp[index] = { ...newExp[index], [field]: value };
        setFormData(prev => ({ ...prev, experience: newExp }));
    };

    const checkUsername = async (username: string) => {
        if (!username || username === user?.username) return; // Don't check if empty or same as current
        if (!user?.email) return; // Cannot check exclusion without user email

        setIsCheckingUsername(true);
        try {
            const { data } = await supabase
                .from('users')
                .select('id')
                .eq('username', username)
                .neq('email', user.email) // Exclude self by email
                .maybeSingle();

            if (data) {
                setUsernameError("User already exists, use another.");
            } else {
                setUsernameError(null);
            }
        } catch (error) {
            console.error("Error checking username:", error);
        } finally {
            setIsCheckingUsername(false);
        }
    };

    const handleUsernameBlur = () => {
        if (formData.username) {
            checkUsername(formData.username);
        } else {
            setUsernameError(null);
        }
    };

    const handleStepIntercept = (step: number) => {
        // Intercept logic for Step 4 Phase 2
        // When we are on step 4 AND video upload is NOT showing, we want to intercept, show it, and return true (block stepper)
        if (step === 4 && !showVideoUpload) {
            setShowVideoUpload(true);
            return true;
        }
        return false;
    };

    const handleFinalSubmit = async () => {
        setIsSubmitting(true);
        let finalProfileImageUrl = formData.profile_image_url;
        let muxUploadId = null;
        let muxAssetId = null;
        let muxPlaybackId = null;

        try {
            // 1. Image Upload (Cloudinary)
            if (formData.profile_image) {
                toast.info("Uploading profile image...");
                const signRes = await fetch('/api/upload/cloudinary-sign', { method: 'POST' });
                const signData = await signRes.json();

                if (signData.signature) {
                    const cloudName = signData.cloudName;
                    console.log("Cloudinary Upload Config:", { cloudName, apiKey: signData.apiKey });

                    if (!cloudName) throw new Error("Missing Cloudinary Cloud Name");

                    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
                    const formDataUpload = new FormData();
                    formDataUpload.append('file', formData.profile_image);
                    formDataUpload.append('api_key', signData.apiKey);
                    formDataUpload.append('timestamp', signData.timestamp.toString());
                    formDataUpload.append('signature', signData.signature);
                    formDataUpload.append('folder', 'talent_profiles');

                    const response = await fetch(url, { method: 'POST', body: formDataUpload });
                    const data = await response.json();

                    if (data.secure_url) {
                        finalProfileImageUrl = data.secure_url;
                    } else {
                        throw new Error("Cloudinary upload failed");
                    }
                }
            }

            // 2. Video Upload (Mux)
            if (videoFile) {
                toast.info("Initializing video upload...");
                const muxRes = await fetch('/api/upload/mux', { method: 'POST' });
                const muxData = await muxRes.json();

                if (muxData.uploadUrl) {
                    toast.info("Uploading video reel...");
                    await fetch(muxData.uploadUrl, {
                        method: 'PUT',
                        body: videoFile,
                        headers: { 'Content-Type': videoFile.type }
                    });

                    muxUploadId = muxData.uploadId;
                    // Attempt to poll for asset ID (optional, simplistic)
                }
            }

            // 3. Update Supabase
            const { error } = await supabase
                .from('users')
                .update({
                    username: formData.username,
                    headline: formData.headline,
                    profile_data: {
                        bio: formData.bio,
                        experience: formData.experience,
                    },
                    profile_image: finalProfileImageUrl,
                    mux_upload_id: muxUploadId, // Store upload ID to track processing
                    // mux_asset_id and mux_playback_id will be updated via webhook ideally

                    date_of_birth: formData.dob || null,
                    age: calculateAge(formData.dob),
                    gender: formData.gender,
                    role: formData.category.toLowerCase().replace(' ', '_'), // Core role update
                    category: formData.category,
                    skills: formData.tags, // Sync tags to skills
                    tags: formData.tags,
                    location_city: formData.city,
                    location_state: formData.state,
                    location_country: formData.country,
                    location_lat: formData.lat,
                    location_lng: formData.lng,
                    onboarding_completed: true,
                    status: 'pending' // Reset to pending for review
                })
                .eq('email', user.email);

            if (error) throw error;

            toast.success("Profile Calibrated Successfully!");
            setIsOpen(false);
            onComplete();
        } catch (error: any) {
            console.error('Submission error:', error);
            toast.error(error.message || "Failed to submit profile");
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
                className="absolute inset-0 bg-black/95"
            />

            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="relative w-full max-w-6xl z-10 max-h-[90vh] overflow-y-auto overflow-x-hidden custom-scrollbar"
                data-lenis-prevent
            >
                <Stepper
                    onFinalStepCompleted={handleFinalSubmit}
                    nextButtonText="Continue"
                    backButtonText="Previous"
                    finishButtonText={showVideoUpload ? "Finalize Profile" : "Continue"}
                    interceptNext={handleStepIntercept}
                >
                    {/* Step 1: Core Identity */}
                    <Step>
                        <div className="text-center mb-4 md:mb-8">
                            <h2 className="text-2xl md:text-3xl font-heading font-black text-white pt-2">Identity Calibration</h2>
                            <p className="text-sm md:text-base text-white/40">Initialize your presence on the Grid.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 py-4 md:py-10 px-4 md:px-10">
                            <div className="space-y-6 order-2 md:order-1">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                        <AtSign className="w-3 h-3" /> Unique Identifier
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="liam_smith_actor"
                                            value={formData.username}
                                            onChange={(e) => {
                                                setFormData(prev => ({ ...prev, username: e.target.value }));
                                                if (usernameError) setUsernameError(null); // Clear error on typing
                                            }}
                                            onBlur={handleUsernameBlur}
                                            className={`w-full bg-white/5 border ${usernameError ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-primary/50'} rounded-xl px-4 py-4 text-white outline-none transition-all font-bold cursor-target`}
                                        />
                                        {isCheckingUsername && (
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                            </div>
                                        )}
                                    </div>
                                    {usernameError && (
                                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest mt-2 block pl-1">
                                            {usernameError}
                                        </span>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
                                            <Calendar className="w-3 h-3" /> Date of Birth
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.dob}
                                            onChange={(e) => setFormData(prev => ({ ...prev, dob: e.target.value }))}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-primary/50 outline-none transition-all font-bold scheme-dark appearance-none cursor-target"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
                                            <AtSign className="w-3 h-3" /> Gender
                                        </label>
                                        <div className="relative group">
                                            <select
                                                value={formData.gender}
                                                onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-primary/50 outline-none transition-all font-bold appearance-none cursor-target"
                                            >
                                                <option value="" className="bg-zinc-900">Select</option>
                                                <option value="male" className="bg-zinc-900">Male</option>
                                                <option value="female" className="bg-zinc-900">Female</option>
                                                <option value="non-binary" className="bg-zinc-900">Non-binary</option>
                                                <option value="other" className="bg-zinc-900">Other</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/20 group-hover:text-white/40 transition-colors">
                                                <ChevronDown className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-center justify-center order-1 md:order-2">
                                <label className="relative group cursor-target">
                                    <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                                    <div className="w-32 h-32 md:w-48 md:h-48 rounded-xl border-2 border-dashed border-white/10 group-hover:border-primary/50 transition-all flex items-center justify-center overflow-hidden bg-white/5 shadow-2xl">
                                        {formData.profile_image_url ? (
                                            <img src={formData.profile_image_url} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 text-white/20 group-hover:text-primary/50 transition-colors">
                                                <Camera className="w-10 h-10" />
                                                <span className="text-[10px] font-black uppercase tracking-tighter">Upload Headshot</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute bottom-2 right-2 w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-xl scale-0 group-hover:scale-100 transition-transform">
                                        <Sparkles className="w-5 h-5 fill-white" />
                                    </div>
                                </label>
                            </div>
                        </div>
                    </Step>

                    {/* Step 2: Professional Hook */}
                    <Step>
                        <div className="text-center mb-4 md:mb-8">
                            <h2 className="text-2xl md:text-3xl font-heading font-black text-white pt-2">The Narrative</h2>
                            <p className="text-sm md:text-base text-white/40">How should the industry perceive your talent?</p>
                        </div>

                        <div className="space-y-10 py-4 md:py-10 px-4 md:px-10">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary">Your Headline</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Method Actor specialized in Thriller & Action"
                                    value={formData.headline}
                                    onChange={(e) => setFormData(prev => ({ ...prev, headline: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 md:py-5 md:text-xl text-white focus:border-primary/50 outline-none transition-all font-bold tracking-tight cursor-target"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Short Bio</label>
                                <textarea
                                    placeholder="Tell your story in a few sentences..."
                                    rows={5}
                                    value={formData.bio}
                                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-5 text-white focus:border-primary/50 outline-none transition-all resize-none font-medium leading-relaxed cursor-target"
                                />
                            </div>
                        </div>
                    </Step>

                    {/* Step 3: Taxonomy */}
                    <Step>
                        <div className="text-center mb-4 md:mb-8">
                            <h2 className="text-2xl md:text-3xl font-heading font-black text-white pt-2">
                                {formData.selectedCategory ? `${formData.selectedCategory} Matrix` : 'Skill Matrix'}
                            </h2>
                            <p className="text-sm md:text-base text-white/40">
                                {formData.selectedCategory ? `Select the skills that define your ${formData.selectedCategory.toLowerCase()} craft.` : 'Select your primary role to unlock specialized skills.'}
                            </p>
                        </div>

                        <div className="space-y-12 py-4 md:py-10 px-4 md:px-10">
                            <AnimatePresence mode="wait">
                                {!formData.selectedCategory ? (
                                    <motion.div
                                        key="roles"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="grid grid-cols-2 md:grid-cols-4 gap-3"
                                    >
                                        {Object.keys(SKILL_MAP).map((role) => (
                                            <button
                                                key={role}
                                                onClick={() => setFormData(prev => ({ ...prev, selectedCategory: role, category: role }))}
                                                className="relative px-4 py-8 rounded-xl border bg-white/5 border-white/10 text-white hover:border-primary/50 transition-all font-bold text-xs uppercase tracking-widest group cursor-target overflow-hidden"
                                            >
                                                {ROLE_IMAGES[role] && (
                                                    <>
                                                        <div
                                                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110 opacity-60 group-hover:opacity-80"
                                                            style={{ backgroundImage: `url(${ROLE_IMAGES[role]})` }}
                                                        />
                                                        <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors" />
                                                    </>
                                                )}
                                                <span className="relative z-10 drop-shadow-md">{role}</span>
                                            </button>
                                        ))}
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="skills"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6"
                                    >
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">
                                                {formData.tags.length} Skills Selected
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {SKILL_MAP[formData.selectedCategory]?.map((skill) => (
                                                <button
                                                    key={skill}
                                                    onClick={() => {
                                                        const newTags = formData.tags.includes(skill)
                                                            ? formData.tags.filter(t => t !== skill)
                                                            : [...formData.tags, skill];
                                                        setFormData(prev => ({ ...prev, tags: newTags }));
                                                    }}
                                                    className={`px-4 py-3 rounded-xl border transition-all font-bold text-[10px] uppercase tracking-widest cursor-target ${formData.tags.includes(skill)
                                                        ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                                                        : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'
                                                        }`}
                                                >
                                                    {skill}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="p-6 rounded-xl bg-primary/5 border border-primary/20 flex items-center gap-4">
                                            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary shrink-0">
                                                <Sparkles className="w-5 h-5" />
                                            </div>
                                            <p className="text-[10px] md:text-xs text-white/60 font-medium">
                                                These specialized tags will make you discoverable to producers looking for <span className="text-white font-bold">{formData.selectedCategory}s</span> with your specific talents. <button onClick={() => setFormData(prev => ({ ...prev, selectedCategory: '', tags: [] }))} className="text-primary font-bold underline cursor-target hover:text-primary/80 transition-colors">Change Role</button>
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </Step>

                    {/* Step 4: Final Calibration (Split into Grid Positioning & Video Upload) */}
                    <Step>
                        <AnimatePresence mode="wait">
                            {!showVideoUpload ? (
                                <motion.div
                                    key="grid-form"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <div className="text-center mb-4 md:mb-8">
                                        <h2 className="text-2xl md:text-3xl font-heading font-black text-white pt-2">Grid Positioning</h2>
                                        <p className="text-sm md:text-base text-white/40">Calibrate your location and career history.</p>
                                    </div>

                                    <div className="space-y-12 py-4 md:py-10 px-4 md:px-10">
                                        <div className="flex flex-col md:flex-row gap-4">
                                            <button
                                                onClick={handleLocationDetect}
                                                className="flex-1 px-3 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all flex items-center justify-center gap-3 group cursor-target"
                                            >
                                                <MapPin className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                                                <span className="text-white font-bold">{formData.city ? `${formData.city}, ${formData.country}` : 'Detect My Sector'}</span>
                                            </button>
                                            <div className="flex-2 grid grid-cols-2 gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="City"
                                                    value={formData.city}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                                                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-primary/50 cursor-target"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Country"
                                                    value={formData.country}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                                                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-primary/50 cursor-target"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Latest Best Work</label>
                                            </div>
                                            <div className="space-y-2 p-1">
                                                <input
                                                    placeholder="Project Name"
                                                    value={formData.experience[0]?.project || ''}
                                                    onChange={(e) => updateExperience(0, 'project', e.target.value)}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white placeholder:text-white/30 focus:border-primary/50 outline-none transition-all cursor-target"
                                                />
                                                <div className="flex flex-col md:flex-row gap-2">
                                                    <input
                                                        placeholder="Role / Position"
                                                        value={formData.experience[0]?.role || ''}
                                                        onChange={(e) => updateExperience(0, 'role', e.target.value)}
                                                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white placeholder:text-white/30 focus:border-primary/50 outline-none transition-all w-full cursor-target"
                                                    />
                                                    <input
                                                        placeholder="Year"
                                                        value={formData.experience[0]?.year || ''}
                                                        onChange={(e) => updateExperience(0, 'year', e.target.value)}
                                                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white placeholder:text-white/30 focus:border-primary/50 outline-none transition-all w-full md:w-32 cursor-target"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="video-upload"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <div className="text-center mb-4 md:mb-8">
                                        <h2 className="text-2xl md:text-3xl font-heading font-black text-white pt-2">Showreel Calibration</h2>
                                        <p className="text-sm md:text-base text-white/40">Upload a 30-second clip of your best performance.</p>
                                    </div>

                                    <div className="flex flex-col items-center justify-center py-10 px-4 md:px-10">
                                        <label className="relative group cursor-target w-full max-w-lg">
                                            <input
                                                type="file"
                                                className="hidden"
                                                onChange={handleVideoUpload}
                                                accept="video/mp4,video/mov,video/webm"
                                            />
                                            <div className="w-full h-64 rounded-xl border-2 border-dashed border-white/10 group-hover:border-primary/50 transition-all flex flex-col items-center justify-center overflow-hidden bg-white/5 shadow-2xl relative">
                                                {videoFile ? (
                                                    <div className="flex flex-col items-center gap-3">
                                                        <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                                                            {/* Film icon or similar */}
                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M7 3v18" /><path d="M3 7.5h4" /><path d="M3 12h18" /><path d="M3 16.5h4" /><path d="M17 3v18" /><path d="M17 7.5h4" /><path d="M17 16.5h4" /></svg>
                                                        </div>
                                                        <span className="text-xs font-bold text-white px-4 text-center">{videoFile.name}</span>
                                                        <span className="text-[10px] text-white/40">{(videoFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                                                    </div>
                                                ) : (formData.video_url && !formData.video_url.startsWith('blob:')) ? (
                                                    <div className="aspect-video w-full rounded-xl overflow-hidden bg-zinc-900 border border-white/5 relative group">
                                                        <video src={formData.video_url} className="w-full h-full object-cover" controls />
                                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <span className="text-white text-sm font-bold">Click to change video</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center gap-4 text-white/20 group-hover:text-primary/50 transition-colors p-6 text-center">
                                                        <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center">
                                                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <span className="block text-xs font-black uppercase tracking-widest text-white/60">Upload Video Reel</span>
                                                            <span className="block text-[10px] text-white/40">Max 10MB • ~30 Seconds • MP4/MOV</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </label>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Step>
                </Stepper>

                {isSubmitting && (
                    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/60 rounded-xl">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                        <p className="mt-4 font-black uppercase tracking-[0.3em] text-white text-xs">Finalizing Profile...</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
