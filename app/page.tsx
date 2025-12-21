import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserCircle2, Briefcase, Star, Search, ShieldCheck, Zap } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import GlitchText from "@/components/glitch-text";
import StaggeredMenu from "@/components/staggered-menu";
import SpotlightCard from "@/components/spotlight-card";
import BlobBackground from "@/components/blob-background";
import GridMotion from "@/components/grid-motion";
import LogoLoop from "@/components/logo-loop";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary/20">
      {/* Mobile Staggered Menu */}
      <div className="md:hidden">
        <StaggeredMenu
          isFixed={true}
          displayItemNumbering={false}
          items={[
            { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
            { label: 'How it works', ariaLabel: 'Learn how it works', link: '#how-it-works' },
            { label: 'Features', ariaLabel: 'View our features', link: '#features' },
            { label: 'Pricing', ariaLabel: 'View pricing', link: '#pricing' },
            { label: 'Sign In', ariaLabel: 'Sign in to your account', link: '/login' }
          ]}
          socialItems={[
            { label: 'Twitter', link: 'https://twitter.com' },
            { label: 'Instagram', link: 'https://instagram.com' },
            { label: 'LinkedIn', link: 'https://linkedin.com' }
          ]}
          accentColor="var(--primary)"
          logoElement={
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Star className="text-white w-5 h-5 fill-white" />
              </div>
              <span className="font-heading font-bold text-xl tracking-tight text-foreground">TalentDirect.</span>
            </div>
          }
        />
      </div>

      <nav className="hidden md:flex fixed top-0 w-full z-50 glass border-b border-border/40 px-6 py-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Star className="text-white w-6 h-6 fill-white" />
          </div>
          <span className="font-heading font-bold text-2xl tracking-tight">TalentDirect.</span>
        </div>

        <div className="hidden md:flex items-center gap-8 font-medium text-sm text-muted-foreground">
          <Link href="#how-it-works" className="cursor-target transition-colors hover:text-foreground">How it works</Link>
          <Link href="#features" className="cursor-target transition-colors hover:text-foreground">Features</Link>
          <Link href="#pricing" className="cursor-target transition-colors hover:text-foreground">Pricing</Link>
        </div>

        <div className="flex items-center gap-4">
          <ModeToggle />
          <Link href="/login" className="cursor-target text-sm font-medium hover:text-primary transition-colors">Sign In</Link>
          <Button size="sm" className="cursor-target rounded-full px-6 bg-primary hover:bg-primary/90">Join Platform</Button>
        </div>
      </nav>

      <main className="grow pt-20">
        {/* Hero Section */}
        <section className="px-6 relative overflow-hidden pb-40">
          <GridMotion />

          <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
            {/* Left Column: Text Content */}
            <div className="text-center lg:text-left space-y-8 lg:col-span-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-wider animate-in fade-in slide-in-from-bottom-4 duration-1000 mx-auto lg:mx-0">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                The Gold Standard for Modern Casting
              </div>

              <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tighter text-foreground">
                Connecting <span className="text-red-600 italic inline-flex"><GlitchText speed={1} enableShadows={true}>Premier</GlitchText></span> Talent <br className="hidden lg:block" />
                with the World's Creators.
              </h1>

              <p className="text-lg md:text-lg text-muted-foreground font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
                A bespoke concierge marketplace designed for Actors, Singers, and Industry Professionals to collaborate seamlessly.
              </p>
            </div>

            {/* Right Column: Dynamic Cards */}
            <div className="flex flex-col gap-6 w-full lg:col-span-2 lg:ml-auto">
              <Link href="/talent/register" className="w-full">
                <div className="group relative p-6 lg:p-10 rounded-3xl bg-primary text-white overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/20">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-150 transition-transform duration-700">
                    <UserCircle2 className="w-24 h-24" />
                  </div>
                  <div className="relative z-10 space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                      <UserCircle2 className="w-6 h-6" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-heading text-2xl lg:text-3xl font-bold">Join as Talent</h3>
                      <p className="text-primary-foreground/80 text-base">Actors & Singers. <br />Build your professional portfolio.</p>
                    </div>
                    <div className="inline-flex items-center gap-2 font-bold group-hover:translate-x-2 transition-transform">
                      Get Started <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/industry/register" className="w-full">
                <div className="group relative p-6 lg:p-10 rounded-3xl bg-card border border-border/50 overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-xl">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-150 transition-transform duration-700">
                    <Briefcase className="w-24 h-24 text-foreground" />
                  </div>
                  <div className="relative z-10 space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-heading text-2xl lg:text-3xl font-bold">Find & Hire</h3>
                      <p className="text-muted-foreground text-base">Producers & Directors. <br />Access elite casting database.</p>
                    </div>
                    <div className="inline-flex items-center gap-2 font-bold text-primary group-hover:translate-x-2 transition-transform">
                      Start Hiring <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Dynamic Section: Trusted Partners Logo Loop */}
        <section className="border-y border-border/40 py-6 bg-secondary/5 overflow-hidden">
          <div className="opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <LogoLoop
              logos={[
                { node: "SONY PICTURES" },
                { node: "WARNER BROS." },
                { node: "NETFLIX" },
                { node: "UNIVERSAL" },
                { node: "PARAMOUNT" },
                { node: "DISNEY" },
                { node: "HBO MAX" },
                { node: "AMAZON STUDIOS" },
                { node: "MARVEL" },
                { node: "PIXAR" },
                { node: "20TH CENTURY" },
                { node: "LIONSGATE" },
                { node: "DREAMWORKS" },
                { node: "MGM" },
                { node: "HBO" }
              ].map(item => ({
                ...item,
                node: <span className="text-2xl font-bold tracking-widest uppercase whitespace-nowrap">{item.node}</span>
              }))}
              speed={40}
              gap={80}
              logoHeight={40}
              fadeOut={true}
            />
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32 px-6">
          <div className="max-w-6xl mx-auto space-y-24">
            <div className="text-center space-y-4">
              <h2 className="font-heading text-4xl md:text-5xl font-bold">The Complete Production Toolkit</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Everything you need to discover, manage, and book world-class talent in one place.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Star className="w-8 h-8 text-primary" />,
                  title: "Elite Portfolio Hosting",
                  desc: "High-resolution headshots and 4K reels powered by Cloudinary and Mux for lightning-fast playback."
                },
                {
                  icon: <Search className="w-8 h-8 text-primary" />,
                  title: "Smart Filter Engine",
                  desc: "Search by Age, Category, Skill, and Role with our advanced compound indexing for instant results."
                },
                {
                  icon: <ShieldCheck className="w-8 h-8 text-primary" />,
                  title: "Privacy First",
                  desc: "Concierge contact management. We protect your data and only share once interest is verified."
                },
                {
                  icon: <Zap className="w-8 h-8 text-primary" />,
                  title: "HLS Protected Streaming",
                  desc: "Secure video delivery ensures your reels are viewed across all devices without risk of unauthorized downloads."
                },
                {
                  icon: <Star className="w-8 h-8 text-primary" />,
                  title: "Role Specific Data",
                  desc: "Flexible profiles tailored to whether you are a Stunt Performer, Cinematographer, or Composer."
                },
                {
                  icon: <UserCircle2 className="w-8 h-8 text-primary" />,
                  title: "Unified Login",
                  desc: "Secure authentication powered by Clerk for a zero-friction entry into the marketplace."
                }
              ].map((feature, i) => (
                <SpotlightCard key={i} spotlightColor="rgba(0, 229, 255, 0.2)" className="cursor-target">
                  <div className="space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center">
                      {feature.icon}
                    </div>
                    <h3 className="font-heading text-xl font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                  </div>
                </SpotlightCard>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-6 pb-32">
          <div className="max-w-6xl mx-auto rounded-[3rem] bg-linear-to-br from-primary to-accent p-12 md:p-24 relative overflow-hidden text-center text-white">
            {/* Decorative Circles */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 space-y-10">
              <h2 className="font-heading text-5xl md:text-7xl font-black">Ready to Begin Your Next Production?</h2>
              <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto">Join the directory used by the industry's top casting directors and producers.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="xl" className="cursor-target w-full sm:w-auto rounded-full px-12 py-8 text-xl font-bold bg-white text-primary hover:bg-zinc-100 transition-all duration-300 shadow-2xl">Create Profile</Button>
                <Button size="xl" className="cursor-target w-full sm:w-auto rounded-full px-12 py-8 text-xl font-bold border-2 border-white/40 bg-transparent hover:bg-white/10 text-white transition-all duration-300">Contact Sales</Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/40 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:row items-center justify-between gap-8 text-muted-foreground text-sm">
          <div className="flex items-center gap-2 grayscale brightness-50">
            <Star className="w-5 h-5 fill-secondary" />
            <span className="font-heading font-bold text-lg">TalentDirect.</span>
          </div>
          <p>© 2025 Talent Marketplace. All rights reserved. Built for Industry Leaders.</p>
          <div className="flex gap-8">
            <Link href="#" className="cursor-target hover:text-foreground">Privacy Policy</Link>
            <Link href="#" className="cursor-target hover:text-foreground">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
