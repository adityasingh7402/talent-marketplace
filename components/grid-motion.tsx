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
    const combinedItems = items.length > 0 ? items.slice(0, totalItems) : defaultItems;

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
                                const placeholderText = ["ACTOR", "DIRECTOR", "SING", "CASTING", "PRODUCER", "VOICE", "TALENT"][(rowIndex + itemIndex) % 7];

                                return (
                                    <div key={itemIndex} className="relative">
                                        <div className="relative w-full h-40 lg:h-64 overflow-hidden rounded-[32px] bg-foreground/2 dark:bg-foreground/3 flex items-center justify-center border border-foreground/5 dark:border-foreground/10 transition-colors duration-500">
                                            <div className="p-4 text-center z-1 font-black text-5xl tracking-tighter text-foreground/3 dark:text-foreground/5 select-none uppercase italic">
                                                {placeholderText}
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
