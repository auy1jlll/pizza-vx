import Link from 'next/link';
import { ChevronRight, Clock, Star, Utensils, ShoppingCart } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';

interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl?: string | null;
  isActive: boolean;
  sortOrder: number;
  menuItems?: any[];
}

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Menu - Pizza Builder Pro | Fresh Italian Pizza & Calzones',
    description: 'Explore our full menu featuring fresh pizzas, calzones, sandwiches, salads, and authentic Italian dishes. Order online for delivery or pickup.',
    keywords: 'pizza menu, calzone menu, Italian food, sandwiches, salads, seafood, dinner plates, online ordering',
    openGraph: {
      title: 'Full Menu - Pizza Builder Pro',
      description: 'Browse our complete menu of authentic Italian dishes, pizzas, and more.',
      type: 'website',
      images: ['/pizza-hero.jpg'],
    },
  };
}

// Server-side data fetching
async function getMenuCategories(): Promise<MenuCategory[]> {
  try {
    const categories = await prisma.menuCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        imageUrl: true,
        isActive: true,
        sortOrder: true,
      }
    });

    return categories.map(cat => ({
      ...cat,
      menuItems: [] // Will be loaded by client components if needed
    }));
  } catch (error) {
    console.error('Error fetching menu categories:', error);
    // Return fallback categories
    return [
      {
        id: '1',
        name: 'Sandwiches',
        slug: 'sandwiches',
        description: 'Fresh made-to-order sandwiches with premium ingredients',
        isActive: true,
        sortOrder: 1,
        menuItems: []
      },
      {
        id: '2', 
        name: 'Salads',
        slug: 'salads',
        description: 'Crisp, fresh salads with local ingredients',
        isActive: true,
        sortOrder: 2,
        menuItems: []
      },
      {
        id: '3',
        name: 'Seafood',
        slug: 'seafood', 
        description: 'Fresh seafood dishes from local waters',
        isActive: true,
        sortOrder: 3,
        menuItems: []
      },
      {
        id: '4',
        name: 'Dinner Plates',
        slug: 'dinner-plates',
        description: 'Hearty dinner plates with authentic Italian flavors',
        isActive: true,
        sortOrder: 4,
        menuItems: []
      }
    ];
  }
}

const getCategoryIcon = (slug: string) => {
  switch (slug) {
    case 'pizza':
    case 'pizzas':
    case 'gourmet-pizzas':
    case 'specialty-pizzas':
      return '🍕';
    case 'calzones':
    case 'specialty-calzones':
      return '🥟';
    case 'sandwiches':
    case 'hot-subs':
    case 'cold-subs':
      return '🥪';
    case 'salads':
      return '🥗';
    case 'seafood':
      return '🦞';
    case 'dinner-plates':
    case 'dinners':
      return '🍽️';
    case 'appetizers':
    case 'starters':
      return '🍤';
    case 'pasta':
    case 'spaghetti':
      return '🍝';
    case 'beverages':
    case 'drinks':
      return '🥤';
    case 'desserts':
    case 'sweets':
      return '🍰';
    case 'wraps':
      return '🌯';
    case 'soups':
      return '🍜';
    case 'burgers':
      return '🍔';
    case 'chicken':
      return '🍗';
    case 'wings':
      return '🔥';
    default:
      return '🍴';
  }
};

const getCategoryGradient = (slug: string) => {
  switch (slug) {
    case 'pizza':
    case 'pizzas':
    case 'gourmet-pizzas':
    case 'specialty-pizzas':
      return 'from-red-600 to-orange-600';
    case 'calzones':
    case 'specialty-calzones':
      return 'from-orange-600 to-yellow-600';
    case 'sandwiches':
    case 'hot-subs':
    case 'cold-subs':
      return 'from-yellow-600 to-amber-600';
    case 'salads':
      return 'from-green-600 to-emerald-600';
    case 'seafood':
      return 'from-blue-600 to-cyan-600';
    case 'dinner-plates':
    case 'dinners':
      return 'from-purple-600 to-pink-600';
    case 'appetizers':
    case 'starters':
      return 'from-indigo-600 to-purple-600';
    case 'pasta':
    case 'spaghetti':
      return 'from-pink-600 to-rose-600';
    case 'beverages':
    case 'drinks':
      return 'from-cyan-600 to-blue-600';
    case 'desserts':
    case 'sweets':
      return 'from-rose-600 to-pink-600';
    case 'wraps':
      return 'from-teal-600 to-green-600';
    case 'soups':
      return 'from-amber-600 to-orange-600';
    case 'burgers':
      return 'from-red-700 to-red-600';
    case 'chicken':
      return 'from-yellow-700 to-yellow-600';
    case 'wings':
      return 'from-orange-700 to-red-700';
    default:
      return 'from-slate-600 to-gray-600';
  }
};

export default async function MenuPage() {
  const categories = await getMenuCategories();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Gradient Mesh Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-green-800 to-orange-900"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/30 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
      
      {/* Floating Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>

      {/* Client-side functionality wrapper */}
        {/* Hero Section */}
        <div className="relative z-10">
          <div className="container mx-auto px-4">
            {/* Header */}
            <div className="text-center py-16">
              <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
                Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400">Menu</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
                Discover our authentic Italian dishes, fresh ingredients, and traditional recipes passed down through generations
              </p>
              
              {/* Quick Stats */}
              <div className="flex justify-center items-center space-x-8 mt-8">
                <div className="flex items-center space-x-2 text-gray-300">
                  <Clock className="w-5 h-5 text-green-400" />
                  <span>Fresh Daily</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span>Local Ingredients</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <Utensils className="w-5 h-5 text-orange-400" />
                  <span>Made to Order</span>
                </div>
              </div>
            </div>

            {/* Pizza Builder CTA */}
            <div className="mb-16">
              <div className="bg-gradient-to-r from-orange-600/80 to-red-600/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                      🍕 Build Your Perfect Pizza
                    </h2>
                    <p className="text-gray-200 mb-6 text-lg">
                      Create your custom pizza with our interactive builder. Choose from 50+ fresh toppings, premium cheeses, and artisan crusts.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link 
                        href="/build-pizza"
                        className="bg-white text-orange-600 hover:bg-gray-100 font-bold px-8 py-4 rounded-xl text-lg transition-all duration-300 hover:scale-105 shadow-lg text-center"
                      >
                        🎨 Build Pizza
                      </Link>
                      <Link 
                        href="/gourmet-pizzas"
                        className="border-2 border-white text-white hover:bg-white hover:text-orange-600 font-bold px-8 py-4 rounded-xl text-lg transition-all duration-300 text-center"
                      >
                        ⭐ Specialty Pizzas
                      </Link>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-6xl mb-4">🍕</div>
                    <div className="text-yellow-300 font-bold text-lg">Limited Time: Buy One Get 2nd ½ Off!</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Categories Grid */}
            <div className="mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-12">
                Browse by <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">Category</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categories.map((category) => (
                  <Link 
                    key={category.id}
                    href={`/menu/${category.slug}`}
                    className="group transform transition-all duration-300 hover:scale-105"
                  >
                    <div className={`bg-gradient-to-br ${getCategoryGradient(category.slug)} rounded-2xl p-6 h-full border border-white/20 shadow-xl hover:shadow-2xl backdrop-blur-sm relative overflow-hidden`}>
                      {/* Background Pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-4 right-4 text-4xl transform rotate-12">
                          {getCategoryIcon(category.slug)}
                        </div>
                        <div className="absolute bottom-4 left-4 text-6xl opacity-30">
                          {getCategoryIcon(category.slug)}
                        </div>
                      </div>
                      
                      <div className="relative z-10">
                        <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                          {getCategoryIcon(category.slug)}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-200 transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-gray-200 text-sm mb-4 line-clamp-2">
                          {category.description || 'Delicious menu items await!'}
                        </p>
                        <div className="flex items-center text-yellow-300 font-medium group-hover:text-yellow-200 transition-colors">
                          <span>Explore Menu</span>
                          <ChevronRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="text-center py-12">
              <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-white/20 inline-block">
                <h3 className="text-2xl font-bold text-white mb-4">Can't decide? 🤔</h3>
                <p className="text-gray-300 mb-6">Let our chef's recommendations guide you to the perfect meal</p>
                <Link 
                  href="/gourmet-pizzas"
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  ⭐ Chef's Specials
                </Link>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
