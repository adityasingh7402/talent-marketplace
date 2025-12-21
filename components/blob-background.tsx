"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function BlobBackground() {
    const containerRef = useRef<HTMLDivElement>(null);

    // Path data from the user's provided SVG
    const blobPaths = [
        "M326.2,149.5c-5,19.2-21.4,29.2-37.8,26.6c-16.5-2.9-33.4-12.9-37.1-26.6c-3.8-13.6,12.5-32.1,37.8-34.9C314.4,111.8,331.3,130.4,326.2,149.5z",
        "M320.5,146.4c-4.4,10.1-16.4,20.2-26.8,25.3c-10.4,5.2-22.4-2.9-26.8-15.2c-4.4-11.6,7.6-20.4,26.8-25.3C312.9,126.3,324.9,135.6,320.5,146.4z",
        "M278,147.7c2.7-7.1,9.4-15.7,15.4-16.4c5.9-0.4,12.6,8.5,15.4,16.9c2.7,8.4-4.2,14.9-15.4,14.2C282.2,161.5,275.3,154.8,278,147.7z",
        "M312.7,147.3c-2.1,16.4-15.3,27.2-23.2,25.3c-8.1-1.8-12.6-13-14.8-24.9c-1.9-11.8,2.7-22.7,14.8-25.3C301.5,119.6,314.7,130.8,312.7,147.3z",
        "M317.8,147.4c-1,8.2-9.8,10.3-13.8,9.3c-4-0.9-6.5-3-7.6-8.9c-1-5.9,2.3-8.5,8.4-9.8C310.8,136.6,318.8,139.1,317.8,147.4z"
    ];

    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            const blobs = containerRef.current?.querySelectorAll(".blob-path");

            if (blobs && blobs.length > 0) {
                // Initial distribution
                blobs.forEach((blob) => {
                    gsap.set(blob, {
                        x: gsap.utils.random(-100, 1000), // Spread across a wider area
                        y: gsap.utils.random(-100, 800),
                        scale: gsap.utils.random(3, 6), // Scale up because original paths are small (~50px)
                        transformOrigin: "center center",
                        opacity: 0.9
                    });
                });

                // Animate
                gsap.to(blobs, {
                    x: "random(-200, 1200)", // Move widely
                    y: "random(-200, 800)",
                    rotation: "random(-180, 180)", // Rotate for more natural shape feeling
                    scale: "random(3, 6)", // Pulse size
                    duration: "random(20, 35)",
                    ease: "sine.inOut",
                    repeat: -1,
                    yoyo: true,
                    repeatRefresh: true
                });
            }
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
        >
            <svg className="w-full h-full">
                <defs>
                    <filter id="goo">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur" />
                        <feColorMatrix
                            in="blur"
                            mode="matrix"
                            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
                            result="goo"
                        />
                        <feBlend in="SourceGraphic" in2="goo" />
                    </filter>

                    {/* Gradients to match the project theme */}
                    <linearGradient id="grad-blue" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: "var(--primary)", stopOpacity: 0.8 }} />
                        <stop offset="100%" style={{ stopColor: "var(--primary)", stopOpacity: 0.4 }} />
                    </linearGradient>
                    <linearGradient id="grad-accent" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: "var(--accent)", stopOpacity: 0.8 }} />
                        <stop offset="100%" style={{ stopColor: "#FF8C00", stopOpacity: 0.4 }} />
                    </linearGradient>
                </defs>

                {/* 
                    Group applying the Goo filter. 
                    Using the exact paths from the reference SVG.
                */}
                <g filter="url(#goo)">
                    {blobPaths.map((d, i) => (
                        <path
                            key={i}
                            className="blob-path"
                            d={d}
                            fill={i % 2 === 0 ? "url(#grad-blue)" : "url(#grad-accent)"}
                        />
                    ))}
                </g>
            </svg>
        </div>
    );
}
