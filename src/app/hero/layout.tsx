import type { Metadata } from "next";
import "../globals.css";
import { CartProvider } from '@/contexts/CartContext';
import { UserProvider } from '@/contexts/UserContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { AppSettingsProvider } from '@/contexts/AppSettingsContext';
import { ToastProvider } from '@/components/ToastProvider';
import { SexyToastProvider } from '@/components/SexyToastProvider';

export const metadata: Metadata = {
  title: "Hero Page - Local Pizza House",
  description: "Hero page design mockup with placeholders",
};

export default function HeroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <SettingsProvider>
        <AppSettingsProvider>
          <CartProvider>
            <ToastProvider>
              <SexyToastProvider>
                {children}
              </SexyToastProvider>
            </ToastProvider>
          </CartProvider>
        </AppSettingsProvider>
      </SettingsProvider>
    </UserProvider>
  );
}
