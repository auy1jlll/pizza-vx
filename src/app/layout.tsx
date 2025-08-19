import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from '@/contexts/CartContext';
import { UserProvider } from '@/contexts/UserContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { AppSettingsProvider } from '@/contexts/AppSettingsContext';
import { ToastProvider } from '@/components/ToastProvider';
import { SexyToastProvider } from '@/components/SexyToastProvider';
import FloatingCartButton from '@/components/FloatingCartButton';
import HybridNavigation from '@/components/HybridNavigation';
import DynamicFooter from '@/components/DynamicFooter';
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
                    <HybridNavigation />
                  
                  <main>
                    {children}
                  </main>
                  
                  <FloatingCartButton />
                  
                  <DynamicFooter />
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
