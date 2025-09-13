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
import PWAInstall, { PWAStatus } from '@/components/PWAInstall';
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
        {/* PWA Meta Tags */}
        <meta name="application-name" content="Greenland Famous Pizza" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Greenland Pizza" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#dc2626" />

        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* PWA Icons */}
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/pizza-icon.svg" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/pizza-icon.svg" />
        <link rel="apple-touch-icon" href="/icons/pizza-icon.svg" />

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
                    <PWAInstall />
                    <PWAStatus />
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
