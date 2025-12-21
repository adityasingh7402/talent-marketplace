"use client";

import { useEffect, useRef, FC, ReactNode } from 'react';
import { gsap } from 'gsap';

interface GridMotionProps {
    items?: (string | ReactNode)[];
}

const GridMotion: FC<GridMotionProps> = ({ items = [] }) => {
    const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

    const totalItems = 28;
    const defaultItems = Array.from({ length: totalItems }, (_, index) => ``);

    // Cinematic Content Pool
    const cinemaContent = [
        { text: "ACTOR", img: "/grid/actor.png" },
        { text: "CINEMA", img: "/grid/camera.png" },
        { text: "SING", img: "/grid/singer.png" },
        { text: "DIRECT", img: "/grid/director.png" },
        { text: "STUNT", img: "/grid/stunt.png" },
        { text: "PRODUCE", img: "/grid/clapper.png" },
        { text: "CASTING", img: "/grid/actor.png" }, // Re-using for variety
    ];

    useEffect(() => {
        // Automatic continuous motion
        rowRefs.current.forEach((row, index) => {
            if (row) {
                const direction = index % 2 === 0 ? 1 : -1;
                const duration = 40 + Math.random() * 20; // slow, random speeds for organic feel

                // Initial position offset
                gsap.set(row, { x: direction === 1 ? -100 : 100 });

                // Continuous infinite loop
                gsap.to(row, {
                    x: direction === 1 ? 100 : -100,
                    duration: duration,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut',
                });
            }
        });
    }, []);

    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0 opacity-100">
            <div className="absolute inset-0 bg-background/60 z-10" /> {/* Darkening overlay for overall grid */}
            <section className="w-full h-full overflow-hidden relative flex items-center justify-center">
                <div className="gap-4 flex-none relative w-[160vw] h-[160vh] grid grid-rows-4 grid-cols-1 rotate-[-15deg] origin-center scale-110">
                    {Array.from({ length: 4 }, (_, rowIndex) => (
                        <div
                            key={rowIndex}
                            className="grid gap-6 grid-cols-7"
                            style={{ willChange: 'transform' }}
                            ref={el => {
                                if (el) rowRefs.current[rowIndex] = el;
                            }}
                        >
                            {Array.from({ length: 7 }, (_, itemIndex) => {
                                const content = cinemaContent[(rowIndex + itemIndex) % cinemaContent.length];

                                return (
                                    <div key={itemIndex} className="relative group">
                                        <div className="relative w-full h-40 lg:h-64 overflow-hidden rounded-[40px] bg-zinc-900 flex items-center justify-center border border-white/5 transition-all duration-700">
                                            {/* Background Image */}
                                            <img
                                                src={content.img}
                                                alt={content.text}
                                                className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale contrast-125 transition-transform duration-1000 group-hover:scale-110"
                                            />
                                            {/* Image Overlay */}
                                            <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent opacity-60" />

                                            {/* Text Overlay */}
                                            <div className="relative p-4 text-center z-10 font-black text-5xl tracking-tighter text-white/10 select-none uppercase italic transition-all duration-500 group-hover:text-primary/20">
                                                {content.text}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default GridMotion;
