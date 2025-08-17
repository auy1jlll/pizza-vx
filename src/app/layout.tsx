import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from '@/contexts/CartContext';
import { UserProvider } from '@/contexts/UserContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { AppSettingsProvider } from '@/contexts/AppSettingsContext';
import { ToastProvider } from '@/components/ToastProvider';
import { SexyToastProvider } from '@/components/SexyToastProvider';
import FloatingCartButton from '@/components/FloatingCartButton';
import DynamicNavigation from '@/components/DynamicNavigation';
import { generateMetadata as generateDynamicMetadata } from '@/lib/dynamic-metadata';

// Instrumentation is only meaningful on the Node server; defer to runtime dynamic import
if (typeof window === 'undefined') {
  // Dynamic import so that any Edge compilation path can tree-shake / skip Node APIs
  import('@/instrumentation').then(m => m.register()).catch(err => {
    console.warn('[INSTRUMENT] registration failed', err);
  });
}

// Use dynamic metadata generation
export const generateMetadata = generateDynamicMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <UserProvider>
          <SettingsProvider>
            <AppSettingsProvider>
              <CartProvider>
                <ToastProvider>
                  <SexyToastProvider>
                    <DynamicNavigation />
                  
                  <main>
                    {children}
                  </main>
                  
                  <FloatingCartButton />
                  
                  <footer className="bg-gray-900 text-white py-8 mt-16">
                    <div className="container mx-auto px-4 text-center">
                      <p>&copy; 2025 Pizza Builder Pro. Built with Next.js, TypeScript, and Tailwind CSS.</p>
                      <p className="mt-2 text-sm text-gray-400">
                        Standalone pizza builder application with complete isolation.
                      </p>
                    </div>
                  </footer>
                </SexyToastProvider>
              </ToastProvider>
            </CartProvider>
            </AppSettingsProvider>
          </SettingsProvider>
        </UserProvider>
      </body>
    </html>
  );
}
