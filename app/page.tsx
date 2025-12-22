"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Star, UserCircle2, Briefcase, Search, ShieldCheck, Zap, ChevronRight } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import GlitchText from "@/components/glitch-text";
import StaggeredMenu from "@/components/staggered-menu";
import SpotlightCard from "@/components/spotlight-card";
import GridMotion from "@/components/grid-motion";
import LogoLoop from "@/components/logo-loop";
import MagicBento from "@/components/magic-bento";
import InfiniteMenu from "@/components/infinite-menu";
import Magnetic from "@/components/magnetic";
import Footer from "@/components/footer";
import { useMemo, useRef } from "react";

export default function LandingPage() {
  const [activeCard, setActiveCard] = useState<'talent' | 'industry'>('talent');
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isMobile || isHovered) return;

    const interval = setInterval(() => {
      setActiveCard(prev => prev === 'talent' ? 'industry' : 'talent');
    }, 8000);

    return () => clearInterval(interval);
  }, [isMobile, isHovered]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const talentBg = "/talent-bg.png";
  const industryBg = "/industry-bg.png";

  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary/20">
      {/* Mobile Staggered Menu */}
      <div className="md:hidden">
        <StaggeredMenu
          isFixed={true}
          displayItemNumbering={false}
          actionElement={<ModeToggle />}
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
              <span className="font-heading font-bold text-xl tracking-tight">TalentDirect.</span>
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
          <Button size="sm" className="cursor-target rounded-full px-6 bg-primary text-primary-foreground hover:bg-primary/90 font-bold border border-primary/20 shadow-[0_0_15px_rgba(239,68,68,0.3)]">Join Platform</Button>
        </div>
      </nav>

      <main className="grow">
        {/* Hero Section */}
        <section className="px-6 relative overflow-hidden min-h-[90vh] flex items-center pt-20 pb-20">
          <GridMotion />

          <div className="relative z-10 max-w-[90rem] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
            {/* Left Column: Text Content */}
            <div className="text-center lg:text-left space-y-8 lg:col-span-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-wider animate-in fade-in slide-in-from-bottom-4 duration-1000 mx-auto lg:mx-0">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                The Gold Standard for Modern Casting
              </div>

              <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tighter text-foreground">
                Connecting <span className="text-primary italic inline-flex"><GlitchText speed={1} enableShadows={true}>Premier</GlitchText></span> Talent <br className="hidden lg:block" />
                with the World's Creators.
              </h1>

              <p className="text-lg md:text-lg text-muted-foreground font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
                A bespoke concierge marketplace designed for Actors, Singers, and Industry Professionals to collaborate seamlessly.
              </p>
            </div>

            {/* Right Column: Dynamic Interactive Cards */}
            <div
              className="flex flex-col sm:flex-row gap-4 w-full lg:col-span-6 lg:ml-auto h-[700px] sm:h-[450px] lg:h-[500px]"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Talent Card */}
              <motion.div
                layout
                initial={false}
                animate={{
                  flex: isMobile ? 1 : (activeCard === 'talent' ? 2.5 : 1),
                }}
                transition={{
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1]
                }}
                onClick={() => !isMobile && setActiveCard('talent')}
                className={`relative rounded-4xl overflow-hidden cursor-pointer group border-2 bg-zinc-950 ${(activeCard === 'talent' || isMobile)
                  ? 'border-primary shadow-2xl shadow-primary/10'
                  : 'border-primary/40 hover:border-primary/60'
                  }`}
              >
                {/* Background Image & Overlay */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                  <motion.img
                    layout
                    animate={{ scale: (activeCard === 'talent' || isMobile) ? 1.1 : 1 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    src={talentBg}
                    className="w-full h-full object-cover opacity-60 transition-opacity group-hover:opacity-75"
                    alt="Talent background"
                  />
                  <motion.div
                    animate={{ backgroundColor: (activeCard === 'talent' || isMobile) ? 'transparent' : 'rgba(0,0,0,0.3)' }}
                    className="absolute inset-0 bg-linear-to-t from-zinc-950/80 via-zinc-950/20 to-transparent"
                  />
                </div>

                <div className="relative z-10 h-full p-6 lg:p-8 flex flex-col justify-between">
                  <motion.div layout="position">
                    <motion.div
                      layout
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-500 ${(activeCard === 'talent' || isMobile) ? 'bg-primary/10 backdrop-blur-md border border-primary/20' : 'bg-secondary/40 backdrop-blur-md'
                        }`}
                    >
                      <UserCircle2 className={`w-6 h-6 ${(activeCard === 'talent' || isMobile) ? 'text-white' : 'text-foreground'}`} />
                    </motion.div>

                    <motion.div layout="position" className="space-y-4">
                      <motion.h3 layout="position" className={`font-heading font-black leading-tight transition-all duration-500 ${(activeCard === 'talent' || isMobile) ? 'text-2xl lg:text-4xl text-primary' : 'text-xl text-foreground'
                        }`}>
                        Join as <br />Talent
                      </motion.h3>

                      <AnimatePresence mode="popLayout">
                        {(activeCard === 'talent' || isMobile) && (
                          <motion.p
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.4 }}
                            className="text-white/60 text-base font-medium max-w-[240px]"
                          >
                            Showcase your skills, build your reel, and get noticed by top industry producers.
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </motion.div>

                  <Link href="/talent/register" className="mt-auto cursor-target">
                    <motion.div
                      layout="position"
                      className={`inline-flex items-center gap-2 font-bold ${(activeCard === 'talent' || isMobile)
                        ? 'text-primary translate-x-0'
                        : 'text-muted-foreground'
                        } ${(activeCard !== 'talent' && !isMobile) ? 'opacity-0 translate-y-4' : 'opacity-100'}`}
                    >
                      Get Started <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                    </motion.div>
                  </Link>

                  {/* Large Background Icon for Sunk State */}
                  {(activeCard !== 'talent' && !isMobile) && (
                    <div className="absolute bottom-0 right-0 p-6 opacity-10">
                      <UserCircle2 className="w-24 h-24" />
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Industry Card */}
              <motion.div
                layout
                initial={false}
                animate={{
                  flex: isMobile ? 1 : (activeCard === 'industry' ? 2.5 : 1),
                }}
                transition={{
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1]
                }}
                onClick={() => !isMobile && setActiveCard('industry')}
                className={`relative rounded-4xl overflow-hidden cursor-pointer group border-2 bg-zinc-950 ${(activeCard === 'industry' || isMobile)
                  ? 'border-primary shadow-2xl shadow-primary/10'
                  : 'border-primary/40 hover:border-primary/60'
                  }`}
              >
                {/* Background Image & Overlay */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                  <motion.img
                    layout
                    animate={{ scale: (activeCard === 'industry' || isMobile) ? 1.1 : 1 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    src={industryBg}
                    className="w-full h-full object-cover opacity-60 transition-opacity group-hover:opacity-75"
                    alt="Industry background"
                  />
                  <motion.div
                    animate={{ backgroundColor: (activeCard === 'industry' || isMobile) ? 'transparent' : 'rgba(0,0,0,0.3)' }}
                    className="absolute inset-0 bg-linear-to-t from-zinc-950/80 via-zinc-950/20 to-transparent"
                  />
                </div>

                <div className="relative z-10 h-full p-6 lg:p-8 flex flex-col justify-between">
                  <motion.div layout="position">
                    <motion.div
                      layout
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-500 ${(activeCard === 'industry' || isMobile) ? 'bg-primary/10 backdrop-blur-md border border-primary/20' : 'bg-secondary/40 backdrop-blur-md'
                        }`}
                    >
                      <Briefcase className={`w-6 h-6 ${(activeCard === 'industry' || isMobile) ? 'text-white' : 'text-foreground'}`} />
                    </motion.div>

                    <motion.div layout="position" className="space-y-4">
                      <motion.h3 layout="position" className={`font-heading font-black leading-tight transition-all duration-500 ${(activeCard === 'industry' || isMobile) ? 'text-2xl lg:text-4xl text-primary' : 'text-xl text-foreground'
                        }`}>
                        Find & <br />Hire
                      </motion.h3>

                      <AnimatePresence mode="popLayout">
                        {(activeCard === 'industry' || isMobile) && (
                          <motion.p
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.4 }}
                            className="text-white/60 text-base font-medium max-w-[240px]"
                          >
                            Access the world's most elite casting database and find the perfect talent for your next project.
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </motion.div>

                  <Link href="/industry/register" className="mt-auto cursor-target">
                    <motion.div
                      layout="position"
                      className={`inline-flex items-center gap-2 font-bold ${(activeCard === 'industry' || isMobile)
                        ? 'text-primary translate-x-0'
                        : 'text-muted-foreground'
                        } ${(activeCard !== 'industry' && !isMobile) ? 'opacity-0 translate-y-4' : 'opacity-100'}`}
                    >
                      Start Hiring <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                    </motion.div>
                  </Link>

                  {/* Large Background Icon for Sunk State */}
                  {(activeCard !== 'industry' && !isMobile) && (
                    <div className="absolute bottom-0 right-0 p-6 opacity-10">
                      <Briefcase className="w-24 h-24" />
                    </div>
                  )}
                </div>
              </motion.div>
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

        {/* Infinite 3D Talent Grid */}
        <section className="h-[70vh] relative bg-zinc-950 overflow-hidden border-y border-white/5">
          {useMemo(() => (
            <InfiniteMenu
              items={[
                {
                  image: '/grid/actor.png',
                  link: '#',
                  title: 'ACTORS',
                  description: 'World-class screen presence for major motion pictures.'
                },
                {
                  image: '/grid/camera.png',
                  link: '#',
                  title: 'DPs',
                  description: 'Mastering light and shadow for cinematic storytelling.'
                },
                {
                  image: '/grid/director.png',
                  link: '#',
                  title: 'DIRECTORS',
                  description: 'Visionaries shaping the next generation of cinema.'
                },
                {
                  image: '/grid/clapper.png',
                  link: '#',
                  title: 'PRODUCERS',
                  description: 'Bringing complex creative visions to reality.'
                },
                {
                  image: '/grid/singer.png',
                  link: '#',
                  title: 'SINGERS',
                  description: 'Vocal powerhouses for soundtracks and musicals.'
                },
                {
                  image: '/grid/stunt.png',
                  link: '#',
                  title: 'STUNTS',
                  description: 'Precision physical performance and high-octane action.'
                }
              ]}
            />
          ), [])}
        </section>

        {/* Features Section */}
        <section id="features" className="min-h-screen flex items-center py-24 px-6 relative overflow-hidden bg-zinc-950/20">
          <div className="max-w-[90rem] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
            {/* Left side (35%) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-wider">
                Platform Essentials
              </div>
              <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-foreground">
                The Complete Production <br /> <span className="text-primary italic">Toolkit.</span>
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground font-medium leading-relaxed max-w-md">
                Everything you need to discover, manage, and book world-class talent in one place, optimized for high-end cinematic workflows.
              </p>

              <div className="flex flex-col gap-4 pt-4 border-t border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-sm font-semibold">4K High-Res Portfolio Hosting</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-sm font-semibold">Instant Compound Filtering</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-sm font-semibold">Secure HLS Stream Protection</span>
                </div>
              </div>
            </div>

            {/* Right side (65%) */}
            <div className="lg:col-span-8 w-full">
              <MagicBento
                textAutoHide={false}
                enableStars={true}
                enableSpotlight={true}
                enableBorderGlow={true}
                enableTilt={true}
                enableMagnetism={true}
                clickEffect={true}
                spotlightRadius={300}
                particleCount={10}
                glowColor="239, 68, 68"
                cards={[
                  {
                    icon: <Star className="w-6 h-6" />,
                    title: "Elite Portfolio Hosting",
                    description: "High-resolution headshots and 4K reels powered by Cloudinary and Mux.",
                    label: "Visuals",
                    image: "/grid/actor.png"
                  },
                  {
                    icon: <Search className="w-6 h-6" />,
                    title: "Smart Filter Engine",
                    description: "Search by Age, Category, Skill, and Role with compound indexing.",
                    label: "Discovery",
                    image: "/grid/camera.png"
                  },
                  {
                    icon: <ShieldCheck className="w-6 h-6" />,
                    title: "Privacy First",
                    description: "Concierge contact management. We protect your data and only share once verified.",
                    label: "Security",
                    image: "/grid/director.png"
                  },
                  {
                    icon: <Zap className="w-6 h-6" />,
                    title: "HLS Protected Streaming",
                    description: "Secure video delivery ensures your reels are viewed without unauthorized downloads.",
                    label: "Protection",
                    image: "/grid/clapper.png"
                  },
                  {
                    icon: <Briefcase className="w-6 h-6" />,
                    title: "Role Specific Data",
                    description: "Flexible profiles tailored to Stunt Performers, Cinematographers, or Composers.",
                    label: "Talent",
                    image: "/grid/singer.png"
                  },
                  {
                    icon: <UserCircle2 className="w-6 h-6" />,
                    title: "Unified Login",
                    description: "Secure authentication powered by Clerk for a zero-friction entry.",
                    label: "Access",
                    image: "/grid/stunt.png"
                  }
                ]}
              />
            </div>
          </div>
        </section>

        {/* Final CTA - Upgraded with Spotlight and Magnetic Effects */}
        <section className="px-6 pb-32">
          <motion.div
            ref={ctaRef}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onMouseMove={(e) => {
              if (!ctaRef.current) return;
              const rect = ctaRef.current.getBoundingClientRect();
              setMousePos({
                x: ((e.clientX - rect.left) / rect.width) * 100,
                y: ((e.clientY - rect.top) / rect.height) * 100,
              });
            }}
            className="max-w-7xl mx-auto rounded-[2rem] md:rounded-[3rem] bg-zinc-950 border border-white/5 shadow-2xl shadow-primary/5 p-8 md:p-24 relative overflow-hidden group"
          >
            {/* Animated Border Beam */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-primary/20 to-transparent w-[200%] h-[200%] animate-[spin_8s_linear_infinite] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            </div>

            {/* Spotlight Mask Background */}
            <div
              className="absolute inset-0 z-0 transition-opacity duration-1000 opacity-20 group-hover:opacity-40"
              style={{
                backgroundImage: `radial-gradient(circle 400px at ${mousePos.x}% ${mousePos.y}%, rgba(239, 68, 68, 0.15), transparent), url('/grid/camera.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                mixBlendMode: 'overlay',
              }}
            />

            {/* Grain/Noise Texture for Pro Look */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            <div className="relative z-10 space-y-8 md:space-y-12 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]"
              >
                Now Casting Globally
              </motion.div>

              <div className="space-y-4 md:space-y-6">
                <h2 className="font-heading text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter text-white leading-[1.1] md:leading-[0.9]">
                  Ready to Begin Your <br />
                  <span className="text-primary italic">
                    <GlitchText speed={0.8} enableShadows={true}>Next Production?</GlitchText>
                  </span>
                </h2>
                <p className="text-lg md:text-2xl text-white/60 max-w-2xl mx-auto font-medium px-4 md:px-0">
                  Join the elite directory used by the industry's top <br className="hidden md:block" />
                  casting directors and producers worldwide.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch justify-center gap-4 md:gap-6 pt-8 w-full max-w-2xl mx-auto">
                <Magnetic strength={0.3} className="w-full flex-1 flex">
                  <Button
                    size="xl"
                    className="cursor-target w-full rounded-full px-8 py-5 md:px-12 md:py-10 text-lg md:text-2xl font-black bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 shadow-[0_0_30px_rgba(239,68,68,0.4)] group/btn border-2 border-transparent"
                  >
                    Create Profile
                    <ChevronRight className="ml-2 w-5 h-5 md:w-6 md:h-6 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Magnetic>

                <Magnetic strength={0.2} className="w-full flex-1 flex">
                  <Button
                    size="xl"
                    className="cursor-target w-full rounded-full px-8 py-5 md:px-12 md:py-10 text-lg md:text-2xl font-black border-2 border-white/10 bg-white/5 hover:bg-white/10 text-white transition-all duration-300 backdrop-blur-md"
                  >
                    Contact Sales
                  </Button>
                </Magnetic>
              </div>
            </div>

            {/* Decorative Floating Elements */}
            <motion.div
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-12 -left-12 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none"
            />
            <motion.div
              animate={{
                y: [0, 20, 0],
                rotate: [0, -5, 0]
              }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-12 -right-12 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none"
            />
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
