import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";
import { StarField } from "@/components/effects/StarField";
import { AuroraBackground } from "@/components/effects/AuroraBackground";
import { FloatingAIButton } from "@/components/layout/FloatingAIButton";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Shreya Rathore | Business Development Associate at CloudNexus",
  description:
    "Shreya Rathore — Business Development Associate at CloudNexus. Building meaningful partnerships and driving innovation through strategic collaboration. B.Tech CSE, Bhopal.",
  keywords: [
    "Shreya Rathore",
    "Business Development",
    "CloudNexus",
    "Bhopal",
    "Client Relations",
    "Growth Strategy",
    "Technology Consulting",
  ],
  authors: [{ name: "Shreya Rathore" }],
  openGraph: {
    title: "Shreya Rathore | Business Development Associate",
    description: "Building Connections. Creating Opportunities. Driving Growth.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <ThemeProvider>
          <div className="relative min-h-screen">
            <AuroraBackground />
            <StarField />
            <Navbar />
            <main className="relative z-10">{children}</main>
            <FloatingAIButton />
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: "rgba(15, 23, 42, 0.9)",
                  color: "#fff",
                  border: "1px solid rgba(124, 58, 237, 0.3)",
                  backdropFilter: "blur(20px)",
                },
              }}
            />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
