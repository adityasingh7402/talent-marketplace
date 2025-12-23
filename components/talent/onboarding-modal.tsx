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

interface OnboardingModalProps {
    user: any;
    onComplete: () => void;
}

export default function OnboardingModal({ user, onComplete }: OnboardingModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        username: '',
        headline: '',
        bio: '',
        dob: '',
        gender: '',
        category: user?.role || 'actor',
        tags: [] as string[],
        city: '',
        state: '',
        country: '',
        lat: null as number | null,
        lng: null as number | null,
        experience: [{ project: '', role: '', year: '' }],
        profile_image: null as File | null,
        profile_image_url: user?.profile_image || '',
        selectedCategory: (user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase() : '') as string
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

    const handleFinalSubmit = async () => {
        setIsSubmitting(true);
        try {
            // 1. Handle Image Upload if new image exists (Simulated for now, would use Cloudinary/S3)
            // For now we just use the ObjectURL or existing

            // 2. Update Supabase
            const { error } = await supabase
                .from('users')
                .update({
                    username: formData.username,
                    headline: formData.headline,
                    profile_data: {
                        bio: formData.bio,
                        experience: formData.experience
                    },
                    date_of_birth: formData.dob || null,
                    gender: formData.gender,
                    category: formData.category,
                    location_city: formData.city,
                    location_state: formData.state,
                    location_country: formData.country,
                    location_lat: formData.lat,
                    location_lng: formData.lng,
                    onboarding_completed: true,
                    status: 'pending' // Reset to pending for review
                })
                .eq('id', user.id);

            if (error) throw error;

            toast.success("Profile Calibrated Successfully!");
            setIsOpen(false);
            onComplete();
        } catch (error: any) {
            toast.error(error.message);
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
                className="absolute inset-0 bg-black/90 backdrop-blur-xl"
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
                                    <input
                                        type="text"
                                        placeholder="liam_smith_actor"
                                        value={formData.username}
                                        onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white focus:border-primary/50 outline-none transition-all font-bold"
                                    />
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
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white focus:border-primary/50 outline-none transition-all font-bold scheme-dark"
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
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white focus:border-primary/50 outline-none transition-all font-bold appearance-none cursor-target"
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
                                    <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border-2 border-dashed border-white/10 group-hover:border-primary/50 transition-all flex items-center justify-center overflow-hidden bg-white/5 shadow-2xl">
                                        {formData.profile_image_url ? (
                                            <img src={formData.profile_image_url} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 text-white/20 group-hover:text-primary/50 transition-colors">
                                                <Camera className="w-10 h-10" />
                                                <span className="text-[10px] font-black uppercase tracking-tighter">Upload Headshot</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute bottom-2 right-2 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white shadow-xl scale-0 group-hover:scale-100 transition-transform">
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
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 md:py-5 text-lg md:text-xl text-white focus:border-primary/50 outline-none transition-all font-bold tracking-tight"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Short Bio</label>
                                <textarea
                                    placeholder="Tell your story in a few sentences..."
                                    rows={5}
                                    value={formData.bio}
                                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-5 text-white focus:border-primary/50 outline-none transition-all resize-none font-medium leading-relaxed"
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
                                                className="px-4 py-4 rounded-2xl border bg-white/5 border-white/10 text-white/60 hover:border-primary/50 hover:text-white transition-all font-bold text-xs uppercase tracking-widest group"
                                            >
                                                <Sparkles className="w-4 h-4 mb-2 mx-auto text-primary/40 group-hover:text-primary transition-colors" />
                                                {role}
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
                                            <button
                                                onClick={() => setFormData(prev => ({ ...prev, selectedCategory: '', tags: [] }))}
                                                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-primary transition-colors"
                                            >
                                                <ArrowLeft className="w-3 h-3" /> Change Primary Role
                                            </button>
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
                                                    className={`px-4 py-3 rounded-2xl border transition-all font-bold text-[10px] uppercase tracking-widest ${formData.tags.includes(skill)
                                                        ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                                                        : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'
                                                        }`}
                                                >
                                                    {skill}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="p-6 rounded-3xl bg-primary/5 border border-primary/20 flex items-center gap-4">
                                            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary shrink-0">
                                                <Sparkles className="w-5 h-5" />
                                            </div>
                                            <p className="text-[10px] md:text-xs text-white/60 font-medium">
                                                These specialized tags will make you discoverable to producers looking for <span className="text-white font-bold">{formData.selectedCategory}s</span> with your specific talents.
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </Step>

                    {/* Step 4: Final Calibration */}
                    <Step>
                        <div className="text-center mb-4 md:mb-8">
                            <h2 className="text-2xl md:text-3xl font-heading font-black text-white pt-2">Grid Positioning</h2>
                            <p className="text-sm md:text-base text-white/40">Calibrate your location and career history.</p>
                        </div>

                        <div className="space-y-12 py-4 md:py-10 px-4 md:px-10">
                            <div className="flex flex-col md:flex-row gap-4">
                                <button
                                    onClick={handleLocationDetect}
                                    className="flex-1 px-6 py-5 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all flex items-center justify-center gap-3 group cursor-target"
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
                                        className="bg-white/5 border border-white/10 rounded-2xl px-4 py-2 text-white text-sm outline-none focus:border-primary/50"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Country"
                                        value={formData.country}
                                        onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                                        className="bg-white/5 border border-white/10 rounded-2xl px-4 py-2 text-white text-sm outline-none focus:border-primary/50"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Notable Experience</label>
                                    <button
                                        onClick={addExperience}
                                        className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
                                    >
                                        + Add Credit
                                    </button>
                                </div>
                                <div className="max-h-[160px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                                    {formData.experience.map((exp, idx) => (
                                        <div key={idx} className="grid grid-cols-3 gap-2">
                                            <input
                                                placeholder="Project"
                                                value={exp.project}
                                                onChange={(e) => updateExperience(idx, 'project', e.target.value)}
                                                className="bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-xs text-white"
                                            />
                                            <input
                                                placeholder="Role"
                                                value={exp.role}
                                                onChange={(e) => updateExperience(idx, 'role', e.target.value)}
                                                className="bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-xs text-white"
                                            />
                                            <input
                                                placeholder="Year"
                                                value={exp.year}
                                                onChange={(e) => updateExperience(idx, 'year', e.target.value)}
                                                className="bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-xs text-white"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Step>
                </Stepper>

                {isSubmitting && (
                    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/60 rounded-4xl">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                        <p className="mt-4 font-black uppercase tracking-[0.3em] text-white text-xs">Finalizing Profile...</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
