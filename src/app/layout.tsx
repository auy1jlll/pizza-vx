import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { CartProvider } from '@/contexts/CartContext';
import FloatingCart from '@/components/FloatingCart';
import ToastContainer from '@/components/ToastContainer';

export const metadata: Metadata = {
  title: "Pizza Builder Pro",
  description: "Build your perfect pizza with our interactive pizza builder",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased"
      >
        <CartProvider>
          <nav className="bg-gradient-to-r from-emerald-800 to-green-700 shadow-lg border-b border-green-600">
            <div className="container mx-auto px-4">
              <div className="flex justify-between items-center py-4">
                <Link href="/" className="text-2xl font-bold text-white hover:text-orange-300 transition-colors">
                  🍕 <span className="text-orange-300">Boston</span> <span className="text-green-200">Pizza Co.</span>
                </Link>
                
                <div className="flex space-x-6">
                  <Link 
                    href="/" 
                    className="text-white hover:text-orange-300 transition-colors font-medium"
                  >
                    Home
                  </Link>
                  <Link 
                    href="/specialty-pizzas" 
                    className="text-white hover:text-orange-300 transition-colors font-medium"
                  >
                    Specialty Pizzas
                  </Link>
                  <Link 
                    href="/pizza-builder" 
                    className="text-white hover:text-orange-300 transition-colors font-medium"
                  >
                    Build Pizza
                  </Link>
                  <Link 
                    href="/admin" 
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    Admin
                  </Link>
                </div>
              </div>
            </div>
          </nav>
          
          <main>
            {children}
          </main>
          
          <FloatingCart />
          <ToastContainer />
          
          <footer className="bg-gray-900 text-white py-8 mt-16">
            <div className="container mx-auto px-4 text-center">
              <p>&copy; 2025 Pizza Builder Pro. Built with Next.js, TypeScript, and Tailwind CSS.</p>
              <p className="mt-2 text-sm text-gray-400">
                Standalone pizza builder application with complete isolation.
              </p>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
