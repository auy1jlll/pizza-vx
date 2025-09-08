import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from '@/contexts/CartContext';
import { UserProvider } from '@/contexts/UserContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { AppSettingsProvider } from '@/contexts/AppSettingsContext';
import { ToastProvider } from '@/components/ToastProvider';
import { SexyToastProvider } from '@/components/SexyToastProvider';
import { ConditionalTopNavigation, ConditionalBottomElements } from '@/components/ConditionalNavigation';
import RestaurantStructuredData from '@/components/RestaurantStructuredData';
import LocalBusinessStructuredData from '@/components/LocalBusinessStructuredData';
import Analytics from '@/components/Analytics';
import { generateMetadata as generateDynamicMetadata } from '@/lib/dynamic-metadata';

// Use dynamic metadata generation
export const generateMetadata = generateDynamicMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <RestaurantStructuredData />
        <LocalBusinessStructuredData />
        <Analytics />
      </head>
      <body className="antialiased">
        <SexyToastProvider>
          <ToastProvider>
            <SettingsProvider>
              <UserProvider>
                <CartProvider>
                  <AppSettingsProvider>
                    <ConditionalTopNavigation />
                    <main>
                      {children}
                    </main>
                    <ConditionalBottomElements />
                  </AppSettingsProvider>
                </CartProvider>
              </UserProvider>
            </SettingsProvider>
          </ToastProvider>
        </SexyToastProvider>
      </body>
    </html>
  );
}
