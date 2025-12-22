"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { usePathname } from "next/navigation";
import { motion, useAnimationControls } from 'framer-motion';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function PageTransition() {
    const [isMobile, setIsMobile] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const pathname = usePathname();
    const lastPathname = useRef(pathname);
    const controls = useAnimationControls();

    useEffect(() => {
        setIsClient(true);
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Desktop GSAP Transition
    useIsomorphicLayoutEffect(() => {
        if (!isClient || isMobile) return;

        // We want it to run on initial load and on every route change
        const tl = gsap.timeline();

        // Prevent scrolling during transition
        document.body.style.overflow = "hidden";

        // Immediate state preparation to prevent flash
        gsap.set(".panels", {
            display: "block",
            clipPath: "circle(100% at 50% 50%)",
            skewX: -35
        });

        gsap.set(".panels .panel", {
            scaleY: 0
        });

        // Hide the new content immediately
        gsap.set(".page-main-reveal", {
            clipPath: "circle(0% at 50% 50%)"
        });

        // Start Timeline
        tl.to(".panels .panel:first-child, .panels .panel:last-child", {
            scaleY: 1,
            duration: 0.8,
            ease: "power4.inOut"
        })
            .to(".panels .panel:not(:first-child):not(:last-child)", {
                scaleY: 1,
                duration: 0.4,
                ease: "power2.inOut"
            }, "-=0.4")
            .to(".panels .panel", {
                scaleY: 0,
                duration: 0.3,
                stagger: 0.05,
                ease: "power2.inOut"
            })
            .to(".panels", {
                clipPath: "circle(0% at 50% 50%)",
                skewX: 0,
                duration: 0.8,
                ease: "power4.inOut"
            })
            .to(".page-main-reveal", {
                clipPath: "circle(100% at 50% 50%)",
                duration: 0.8,
                ease: "power4.inOut",
                onComplete: () => {
                    document.body.style.overflow = "";
                    lastPathname.current = pathname;
                }
            }, "-=0.3")
            .set(".panels", { display: "none" });

        return () => {
            tl.kill();
            document.body.style.overflow = "";
        };
    }, [pathname, isMobile, isClient]);

    const [transitionEnded, setTransitionEnded] = useState(false);

    // Mobile Framer Motion Transition
    useEffect(() => {
        if (!isClient || !isMobile) return;
        setTransitionEnded(false);

        const sequence = async () => {
            // First move to right edge (cover screen)
            await controls.start({
                x: "100%",
                transition: { duration: 0.4, ease: "easeInOut" }
            });
            // Then reverse with width animation (reveal screen)
            await controls.start({
                x: "0%",
                width: "0%",
                transition: { duration: 0.8, ease: "easeInOut" }
            });
            window.dispatchEvent(new Event('transitionComplete'));
            document.body.style.overflow = "visible";
            document.documentElement.style.overflow = "visible";

            lastPathname.current = pathname;
            setTransitionEnded(true);
        };

        document.body.style.overflow = "hidden";
        sequence();

        return () => {
            document.body.style.overflow = "visible";
        };
    }, [pathname, isMobile, isClient, controls]);

    if (!isClient) return null;

    if (isMobile) {
        const showPanels = !transitionEnded || lastPathname.current !== pathname;

        return (
            <>
                <style dangerouslySetInnerHTML={{
                    __html: `
                    .page-main-reveal {
                        clip-path: none !important;
                        pointer-events: auto !important;
                    }
                    body {
                        overflow: visible !important;
                        touch-action: auto !important;
                        -webkit-overflow-scrolling: touch !important;
                    }
                    html {
                        overflow: visible !important;
                    }
                ` }} />
                {showPanels && (
                    <>
                        <motion.div
                            key={`mobile-p1-${pathname}`}
                            className='fixed top-0 bottom-0 right-full w-screen h-screen z-[999] bg-primary pointer-events-none'
                            initial={{ x: "0", width: "100%" }}
                            animate={controls}
                        />
                        <motion.div
                            key={`mobile-p2-${pathname}`}
                            className='fixed top-0 bottom-0 right-full w-screen h-screen z-[998] bg-muted pointer-events-none'
                            initial={{ x: "100%", width: "100%" }}
                            animate={{ x: "0%", width: "0%" }}
                            transition={{ delay: 0.6, duration: 0.8, ease: "easeInOut" }}
                        />
                        <motion.div
                            key={`mobile-p3-${pathname}`}
                            className='fixed top-0 bottom-0 right-full w-screen h-screen z-[997] bg-background pointer-events-none'
                            initial={{ x: "100%", width: "100%" }}
                            animate={{ x: "0%", width: "0%" }}
                            transition={{ delay: 0.8, duration: 0.8, ease: "easeInOut" }}
                            onAnimationComplete={() => {
                                if (lastPathname.current === pathname) {
                                    setTransitionEnded(true);
                                }
                            }}
                        />
                    </>
                )}
            </>
        );
    }

    return (
        <ul className="panels fixed top-0 left-1/2 w-[180vw] h-full -translate-x-1/2 -skew-x-35 pointer-events-none z-9999 overflow-hidden list-none bg-primary" style={{ clipPath: "circle(100% at 50% 50%)" }}>
            <li className="panel absolute top-0 bottom-0 left-0 w-[calc(100%/6)] origin-top bg-background"></li>
            <li className="panel absolute top-0 bottom-0 left-[calc(100%/6)] w-[calc(100%/6)] origin-bottom bg-background"></li>
            <li className="panel absolute top-0 bottom-0 left-[calc(200%/6)] w-[calc(100%/6)] origin-top bg-background"></li>
            <li className="panel absolute top-0 bottom-0 left-[calc(300%/6)] w-[calc(100%/6)] origin-bottom bg-background"></li>
            <li className="panel absolute top-0 bottom-0 left-[calc(400%/6)] w-[calc(100%/6)] origin-top bg-background"></li>
            <li className="panel absolute top-0 bottom-0 left-[calc(500%/6)] w-[calc(100%/6)] origin-bottom bg-background"></li>
        </ul>
    );
}
