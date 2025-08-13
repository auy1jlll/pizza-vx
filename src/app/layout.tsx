import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

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
        <nav className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center py-4">
              <Link href="/" className="text-2xl font-bold text-red-600">
                🍕 Pizza Builder Pro
              </Link>
              
              <div className="flex space-x-6">
                <Link 
                  href="/" 
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Home
                </Link>
                <Link 
                  href="/pizza-builder" 
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Build Pizza
                </Link>
                <Link 
                  href="/admin" 
                  className="text-gray-600 hover:text-gray-900 transition-colors"
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
        
        <footer className="bg-gray-900 text-white py-8 mt-16">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; 2025 Pizza Builder Pro. Built with Next.js, TypeScript, and Tailwind CSS.</p>
            <p className="mt-2 text-sm text-gray-400">
              Standalone pizza builder application with complete isolation.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
