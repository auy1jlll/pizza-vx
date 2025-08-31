'use client';

import AdminPageLayout from '@/components/AdminPageLayout';
import Link from 'next/link';
import { 
  CakeIcon, 
  CircleStackIcon, 
  BeakerIcon, 
  SparklesIcon,
  StarIcon
} from '@heroicons/react/24/outline';

export default function PizzaManagerPage() {
  const pizzaComponents = [
    {
      title: 'Pizza Sizes',
      description: 'Manage available pizza sizes and their base pricing',
      icon: CakeIcon,
      href: '/management-portal/sizes',
      color: 'bg-blue-500',
      stats: 'Base configurations'
    },
    {
      title: 'Pizza Crusts', 
      description: 'Configure crust types and their price modifiers',
      icon: CircleStackIcon,
      href: '/management-portal/crusts',
      color: 'bg-amber-500',
      stats: 'Foundation options'
    },
    {
      title: 'Pizza Sauces',
      description: 'Set up sauce varieties with spice levels and pricing',
      icon: BeakerIcon,
      href: '/management-portal/sauces',
      color: 'bg-red-500',
      stats: 'Flavor profiles'
    },
    {
      title: 'Pizza Toppings',
      description: 'Manage topping categories, pricing, and availability',
      icon: SparklesIcon,
      href: '/management-portal/toppings',
      color: 'bg-green-500',
      stats: 'Customization options'
    },
    {
      title: 'Specialty Pizzas',
      description: 'Create and manage signature specialty pizza combinations',
      icon: StarIcon,
      href: '/management-portal/specialty-pizzas',
      color: 'bg-purple-500',
      stats: 'Signature creations'
    }
  ];

  return (
    <AdminPageLayout 
      title="Pizza Manager"
      description="Centralized management for all pizza components. Configure sizes, crusts, sauces, toppings, and specialty pizzas from one location."
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {pizzaComponents.map((component) => {
          const IconComponent = component.icon;
          return (
            <Link
              key={component.title}
              href={component.href}
              className="group relative overflow-hidden rounded-lg backdrop-blur-xl bg-white/10 border border-white/20 shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105 hover:bg-white/20"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${component.color}`}>
                    <IconComponent className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-medium text-white group-hover:text-orange-300">
                      {component.title}
                    </h3>
                    <p className="text-sm text-white/70">{component.stats}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-white/80">
                    {component.description}
                  </p>
                </div>
                <div className="mt-4">
                  <span className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-400/20 to-pink-400/20 border border-orange-400/30 px-2.5 py-0.5 text-xs font-medium text-orange-300 group-hover:bg-gradient-to-r group-hover:from-orange-400/30 group-hover:to-pink-400/30">
                    Manage →
                  </span>
                </div>
              </div>
              
              {/* Gradient overlay for hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 transition-opacity duration-200 group-hover:opacity-100"></div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions Section */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg backdrop-blur-xl bg-white/10 border border-white/20 p-4 text-center">
            <div className="text-2xl font-bold text-white">5</div>
            <div className="text-sm text-white/70">Component Types</div>
          </div>
          <div className="rounded-lg backdrop-blur-xl bg-blue-500/20 border border-blue-400/30 p-4 text-center">
            <div className="text-2xl font-bold text-blue-300">∞</div>
            <div className="text-sm text-white/70">Combinations</div>
          </div>
          <div className="rounded-lg backdrop-blur-xl bg-green-500/20 border border-green-400/30 p-4 text-center">
            <div className="text-2xl font-bold text-green-300">100%</div>
            <div className="text-sm text-white/70">Customizable</div>
          </div>
          <div className="rounded-lg backdrop-blur-xl bg-purple-500/20 border border-purple-400/30 p-4 text-center">
            <div className="text-2xl font-bold text-purple-300">24/7</div>
            <div className="text-sm text-white/70">Management</div>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="mt-12">
        <div className="rounded-lg backdrop-blur-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-400/30 p-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-300">
                Pro Tips for Pizza Management
              </h3>
              <div className="mt-2 text-sm text-white/80">
                <ul className="list-disc list-inside space-y-1">
                  <li>Start with basic sizes and expand based on customer demand</li>
                  <li>Price modifiers for crusts and sauces help optimize profit margins</li>
                  <li>Organize toppings by category for easier kitchen operations</li>
                  <li>Keep seasonal toppings marked as inactive during off-seasons</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminPageLayout>
  );
}
