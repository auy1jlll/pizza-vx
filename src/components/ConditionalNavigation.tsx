'use client';

import { usePathname } from 'next/navigation';
import HybridNavigation from '@/components/HybridNavigation';
import FloatingCartButton from '@/components/FloatingCartButton';
import DynamicFooter from '@/components/DynamicFooter';

// Component for top navigation (renders before main content)
export function ConditionalTopNavigation() {
  const pathname = usePathname();
  
  // Hide public navigation on admin pages
  const isAdminRoute = pathname?.startsWith('/management-portal');
  
  if (isAdminRoute) {
    return null; // Don't render public navigation on admin pages
  }
  
  return <HybridNavigation />;
}

// Component for bottom elements (renders after main content)
export function ConditionalBottomElements() {
  const pathname = usePathname();
  
  // Hide public navigation on admin pages
  const isAdminRoute = pathname?.startsWith('/management-portal');
  
  if (isAdminRoute) {
    return null; // Don't render public navigation on admin pages
  }
  
  return (
    <>
      <FloatingCartButton />
      <DynamicFooter />
    </>
  );
}

// Default export for backward compatibility
export default function ConditionalNavigation() {
  return (
    <>
      <ConditionalTopNavigation />
      <ConditionalBottomElements />
    </>
  );
}
