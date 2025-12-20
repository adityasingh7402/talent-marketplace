import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserCircle2, Briefcase, Star, Search, ShieldCheck, Zap } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import GlitchText from "@/components/glitch-text";
import StaggeredMenu from "@/components/staggered-menu";
import SpotlightCard from "@/components/spotlight-card";

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

      <main className="grow pt-32">
        {/* Hero Section */}
        <section className="px-6 relative overflow-hidden pb-20">
          {/* Background Blobs */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] -z-10" />

          <div className="max-w-6xl mx-auto text-center space-y-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-secondary/5 text-sm font-medium animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              The Gold Standard for Modern Casting
            </div>

            <h1 className="font-heading text-6xl md:text-8xl font-black leading-[1.1] tracking-tighter text-foreground max-w-4xl mx-auto">
              Connecting <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-accent"><GlitchText speed={0.8} enableOnHover={false} className="inline-block translate-y-[2px]">Premier</GlitchText> Talent</span> with the World's Creators.
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              A bespoke concierge marketplace designed for Actors, Singers, and Industry Professionals to collaborate seamlessly.
            </p>

            {/* TWO MAIN PATHS */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
              <Link href="/talent/register" className="w-full sm:w-auto">
                <div className="group relative p-px rounded-2xl bg-linear-to-br from-primary via-primary/50 to-primary/20">
                  <div className="relative bg-background rounded-[15px] p-8 space-y-6 flex flex-col items-center hover:bg-transparent transition-all duration-500 overflow-hidden">
                    <UserCircle2 className="w-16 h-16 text-primary group-hover:scale-110 transition-transform duration-500" />
                    <div className="text-center space-y-2">
                      <h3 className="font-heading text-2xl font-bold">Join as Talent</h3>
                      <p className="text-muted-foreground text-sm max-w-[200px]">Actors, Singers, Directors. Build your legacy portfolio.</p>
                    </div>
                    <Button className="cursor-target w-full rounded-xl py-6 text-lg font-bold">Get Started</Button>
                  </div>
                </div>
              </Link>

              <Link href="/industry/register" className="cursor-target w-full sm:w-auto">
                <div className="group relative p-px rounded-2xl border border-border/60 hover:border-accent transition-all duration-300">
                  <div className="relative bg-background/50 backdrop-blur-sm rounded-[15px] p-8 space-y-6 flex flex-col items-center hover:bg-accent/5 transition-all duration-500">
                    <Briefcase className="w-16 h-16 text-accent group-hover:scale-110 transition-transform duration-500" />
                    <div className="text-center space-y-2">
                      <h3 className="font-heading text-2xl font-bold">Find & Hire</h3>
                      <p className="text-muted-foreground text-sm max-w-[200px]">Producers & Casting Directors. Access the elite directory.</p>
                    </div>
                    <Button variant="outline" className="cursor-target w-full rounded-xl py-6 text-lg font-bold border-accent/20 hover:bg-accent hover:text-white transition-all duration-300">Browse Catalog</Button>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Dynamic Section: Stats/Trusted */}
        <section className="border-y border-border/40 py-12 bg-secondary/5 overflow-hidden">
          <div className="max-w-6xl mx-auto flex flex-wrap justify-around items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="text-xl font-bold tracking-widest uppercase">Sony Pictures</span>
            <span className="text-xl font-bold tracking-widest uppercase">Warner Bros.</span>
            <span className="text-xl font-bold tracking-widest uppercase">Netflix</span>
            <span className="text-xl font-bold tracking-widest uppercase">Universal</span>
            <span className="text-xl font-bold tracking-widest uppercase">Paramount</span>
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
