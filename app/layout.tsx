import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import TargetCursor from "@/components/target-cursor";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Talent & Casting Directory | Concierge Marketplace",
  description: "A premium directory for actors, singers, and industry professionals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${plusJakarta.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          themes={["light", "dark"]}
          storageKey="talent-marketplace-theme"
        >
          <TargetCursor
            spinDuration={2}
            hideDefaultCursor={true}
            parallaxOn={true}
          />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
