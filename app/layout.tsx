import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AGTS Sarlu | Gestion Immo & Auto",
  description: "Plateforme professionnelle de gestion immobilière et automobile - AGTS Sarlu Kinshasa.",
  // On peut ajouter des icônes ici plus tard
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light" // Souvent préféré pour le milieu pro en journée
          enableSystem
          disableTransitionOnChange
        >
          {/* 
              Ici on pourrait ajouter un Wrapper pour Supabase Auth 
              quand on passera à la gestion des rôles (Admin, Agent, Client)
          */}
          
          <main className="min-h-screen">
            {children}
          </main>

          <Toaster position="top-right" closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}