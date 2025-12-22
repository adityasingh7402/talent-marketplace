"use client";

import { usePathname } from "next/navigation";

export default function RevealWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div key={pathname} className="page-main-reveal">
            {children}
        </div>
    );
}
