'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, Settings, Users, BarChart, Home } from 'lucide-react';
import { designSystem, components } from '../lib/design-system';

const adminNavItems = [
  { href: '/admin', icon: Home, label: 'Dashboard' },
  { href: '/admin/pages', icon: FileText, label: 'Pages' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
  { href: '/admin/users', icon: Users, label: 'Users' },
  { href: '/admin/analytics', icon: BarChart, label: 'Analytics' },
];

export default function AdminNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-4 left-4 z-50">
      <div className={`${components.card.glass} p-2`}>
        <div className="flex flex-col space-y-2">
          {adminNavItems.map((item) => {
            const isActive = pathname === item.href || 
                           (item.href !== '/admin' && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'bg-orange-500/20 border border-orange-500/30 text-orange-300' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                  }
                `}
                title={item.label}
              >
                <item.icon className="w-5 h-5" />
                <span className={`${designSystem.small} font-medium`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
