'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BuildCalzonePage() {
  const router = useRouter();

  useEffect(() => {
    // For now, redirect to pizza builder with calzone parameter
    // This is the safest approach - reuse existing code
    router.push('/build-pizza?productType=calzone');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading Calzone Builder...</p>
      </div>
    </div>
  );
}
