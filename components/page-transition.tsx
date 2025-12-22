"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { usePathname } from "next/navigation";

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function PageTransition() {
    const containerRef = useRef<HTMLUListElement>(null);
    const pathname = usePathname();
    const isInitialRender = useRef(true);

    const lastPathname = useRef(pathname);

    useIsomorphicLayoutEffect(() => {
        // We want it to run on initial load and on every route change
        const tl = gsap.timeline();

        // Prevent scrolling during transition
        document.body.style.overflow = "hidden";

        // Immediate state preparation to prevent flash
        // We use a small delay or synchronized set to ensure it catches the new DOM
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
    }, [pathname]);

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
