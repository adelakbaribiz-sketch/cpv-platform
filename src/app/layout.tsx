import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { RoleProvider } from "@/contexts/role-context";
import { LocaleProvider } from "@/contexts/locale-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CPV — Citizens' Proposed Vote",
  description:
    "CPV is a civic participation prototype: discover, deliberate, and vote on community proposals. Demo mode — simulated roles, votes, and metrics.",
  keywords: ["civic", "governance", "participation", "voting", "proposals", "Denmark", "Europe"],
  authors: [{ name: "CPV Contributors" }],
  icons: { icon: "/logo.svg" },
  openGraph: {
    title: "CPV — Citizens' Proposed Vote",
    description: "A civic participation prototype. Demo mode.",
    siteName: "CPV",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen`}
      >
        <LocaleProvider>
          <RoleProvider>
            {children}
            <Toaster />
            <SonnerToaster position="bottom-right" theme="dark" />
          </RoleProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
