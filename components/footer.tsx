"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Twitter, Instagram, Linkedin, ArrowUpRight, Github } from "lucide-react";

const footerLinks = [
    {
        title: "Platform",
        links: [
            { label: "Find Talent", href: "#" },
            { label: "Join as Talent", href: "/talent/register" },
            { label: "Casting Calls", href: "#" },
            { label: "Success Stories", href: "#" },
        ],
    },
    {
        title: "Company",
        links: [
            { label: "Our Story", href: "#" },
            { label: "The Process", href: "#how-it-works" },
            { label: "Features", href: "#features" },
            { label: "Pricing", href: "#pricing" },
        ],
    },
    {
        title: "Support",
        links: [
            { label: "Help Center", href: "#" },
            { label: "Contact Sales", href: "#" },
            { label: "Security", href: "#" },
            { label: "Concierge", href: "#" },
        ],
    },
];

export default function Footer() {
    return (
        <footer className="relative bg-zinc-950 pt-24 pb-12 px-6 border-t border-white/5 overflow-hidden">
            {/* Subtle Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-linear-to-r from-transparent via-primary/50 to-transparent opacity-30" />

            <div className="max-w-[90rem] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-8 mb-20">

                    {/* Brand Column */}
                    <div className="lg:col-span-4 space-y-8">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
                                <Star className="text-white w-6 h-6 fill-white" />
                            </div>
                            <span className="font-heading font-bold text-2xl tracking-tight text-white">TalentDirect.</span>
                        </Link>

                        <p className="text-muted-foreground text-lg font-medium leading-relaxed max-w-sm">
                            The gold standard for modern casting. Connecting premier talent with the world's most innovative creators.
                        </p>

                        <div className="flex items-center gap-4">
                            {[Twitter, Instagram, Linkedin, Github].map((Icon, i) => (
                                <Link
                                    key={i}
                                    href="#"
                                    className="w-10 h-10 rounded-full border border-white/5 bg-white/5 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
                                >
                                    <Icon className="w-5 h-5" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-8">
                        {footerLinks.map((section) => (
                            <div key={section.title} className="space-y-6">
                                <h4 className="text-white font-bold text-sm uppercase tracking-widest">{section.title}</h4>
                                <ul className="space-y-4">
                                    {section.links.map((link) => (
                                        <li key={link.label}>
                                            <Link
                                                href={link.href}
                                                className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center group text-sm font-medium"
                                            >
                                                {link.label}
                                                <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 transition-all" />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Newsletter Column */}
                    <div className="lg:col-span-3 space-y-6">
                        <h4 className="text-white font-bold text-sm uppercase tracking-widest text-center lg:text-left">Stay Informed</h4>
                        <p className="text-muted-foreground text-sm font-medium text-center lg:text-left">
                            Get the latest casting calls and industry news delivered to your inbox.
                        </p>
                        <div className="relative flex items-center group/input">
                            <input
                                type="email"
                                placeholder="email@production.com"
                                className="w-full bg-white/5 border border-white/10 rounded-full pl-6 pr-36 py-4 text-sm text-white focus:outline-hidden focus:border-primary/50 transition-all font-medium"
                            />
                            <button className="absolute right-2 bg-primary text-white font-bold text-xs px-6 py-2.5 rounded-full hover:bg-primary/90 transition-all shadow-lg active:scale-95">
                                Join
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-medium text-muted-foreground">
                    <p>© 2025 TalentDirect Marketplace. All rights reserved. Designed for the Industry.</p>
                    <div className="flex items-center gap-8">
                        <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
