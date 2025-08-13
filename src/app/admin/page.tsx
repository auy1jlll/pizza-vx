'use client';

import AdminLayout from '@/components/AdminLayout';
import Link from 'next/link';

export default function AdminDashboard() {
  const adminCards = [
    {
      title: 'Pizza Sizes',
      description: 'Manage available pizza sizes and their dimensions',
      href: '/admin/sizes',
      icon: '📐',
      count: '3 sizes'
    },
    {
      title: 'Crust Options',
      description: 'Configure different crust types and recipes',
      href: '/admin/crusts',
      icon: '🍞',
      count: '5 crusts'
    },
    {
      title: 'Sauces',
      description: 'Manage sauce varieties and flavor profiles',
      href: '/admin/sauces',
      icon: '🍅',
      count: '4 sauces'
    },
    {
      title: 'Toppings',
      description: 'Configure ingredients and their pricing',
      href: '/admin/toppings',
      icon: '🧀',
      count: '20+ toppings'
    },
    {
      title: 'Specialty Pizzas',
      description: 'Create and manage pre-configured pizza combinations',
      href: '/admin/specialty-pizzas',
      icon: '🍕',
      count: '8 specialties'
    }
  ];

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage your pizza builder components and configurations
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {adminCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-indigo-50 text-2xl group-hover:bg-indigo-100">
                  {card.icon}
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {card.description}
                </p>
                <p className="mt-2 text-xs text-indigo-600 font-medium">
                  {card.count}
                </p>
              </div>
              <span
                className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
                aria-hidden="true"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                </svg>
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Getting Started
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Start by configuring your pizza sizes, then add crust options, sauces, and toppings. 
                  Once you have all components set up, you can create specialty pizzas that combine them into pre-configured options for customers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
