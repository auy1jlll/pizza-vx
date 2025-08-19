'use client';
import dynamic from 'next/dynamic';
import StaticNavigation from './StaticNavigation';

// Dynamically import the full navigation with no SSR to prevent hydration issues
const DynamicNavigationClient = dynamic(
  () => import('./DynamicNavigation'),
  { 
    ssr: false,
    loading: () => <StaticNavigation />
  }
);

export default function Navigation() {
  return <DynamicNavigationClient />;
}
