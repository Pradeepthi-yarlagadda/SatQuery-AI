import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'OrbitIQ — Talk to Earth | Remote-Sensing Vision-Language Platform',
  description: 'AI-powered multimodal vision-language intelligence for satellite imagery. Bi-temporal change detection, optical+SAR fusion, and text-guided spatial grounding for ISRO / SIH26167.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-space-950 text-slate-100 antialiased min-h-screen flex flex-col selection:bg-cyan-500 selection:text-black">
        <Navbar />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
