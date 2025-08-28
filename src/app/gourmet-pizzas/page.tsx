import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';
import Link from 'next/link';
import GourmetPizzasClient from '@/components/GourmetPizzasClient';

interface SpecialtyPizzaSize {
  id: string;
  price: number;
  isAvailable: boolean;
  pizzaSize: {
    id: string;
    name: string;
    diameter: string;
    basePrice: number;
    description?: string | null;
  };
}

interface SpecialtyPizza {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  category: string;
  imageUrl?: string;
  ingredients: string;
  isActive: boolean;
  sizes?: SpecialtyPizzaSize[];
}

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Gourmet Specialty Pizzas - Pizza Builder Pro | Authentic Italian Recipes',
    description: 'Discover our signature gourmet pizzas crafted with authentic Italian recipes, premium ingredients, and traditional techniques. Order online for delivery.',
    keywords: 'gourmet pizza, specialty pizza, authentic Italian pizza, premium ingredients, traditional recipes, artisan pizza',
    openGraph: {
      title: 'Gourmet Specialty Pizzas - Pizza Builder Pro',
      description: 'Authentic Italian gourmet pizzas with premium ingredients and traditional recipes.',
      type: 'website',
      images: ['/pizza-hero.jpg'],
    },
  };
}

// Server-side data fetching
async function getSpecialtyPizzas(): Promise<SpecialtyPizza[]> {
  try {
    const pizzas = await prisma.specialtyPizza.findMany({
      where: { isActive: true },
      include: {
        sizes: {
          include: {
            pizzaSize: true
          },
          where: { isAvailable: true },
          orderBy: {
            pizzaSize: {
              sortOrder: 'asc'
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    return pizzas.map(pizza => ({
      id: pizza.id,
      name: pizza.name,
      description: pizza.description,
      basePrice: pizza.basePrice,
      category: pizza.category,
      imageUrl: pizza.imageUrl || undefined,
      ingredients: pizza.ingredients,
      isActive: pizza.isActive,
      sizes: pizza.sizes.map(size => ({
        id: size.id,
        price: size.price,
        isAvailable: size.isAvailable,
        pizzaSize: {
          id: size.pizzaSize.id,
          name: size.pizzaSize.name,
          diameter: size.pizzaSize.diameter,
          basePrice: size.pizzaSize.basePrice,
          description: size.pizzaSize.description || undefined
        }
      }))
    }));
  } catch (error) {
    console.error('Error fetching specialty pizzas:', error);
    // Return fallback pizzas for SEO
    return [
      {
        id: '1',
        name: 'Margherita Supreme',
        description: 'Classic Italian pizza with fresh mozzarella, San Marzano tomatoes, and fresh basil',
        basePrice: 16.99,
        category: 'Classic',
        ingredients: 'Fresh Mozzarella, San Marzano Tomatoes, Fresh Basil, Extra Virgin Olive Oil',
        isActive: true,
        sizes: []
      },
      {
        id: '2',
        name: 'Quattro Stagioni',
        description: 'Four seasons pizza with artichokes, mushrooms, ham, and olives representing each season',
        basePrice: 19.99,
        category: 'Traditional',
        ingredients: 'Artichokes, Mushrooms, Ham, Black Olives, Mozzarella, Tomato Sauce',
        isActive: true,
        sizes: []
      },
      {
        id: '3',
        name: 'Prosciutto e Arugula',
        description: 'Elegant pizza topped with prosciutto di Parma, fresh arugula, and Parmigiano-Reggiano',
        basePrice: 22.99,
        category: 'Gourmet',
        ingredients: 'Prosciutto di Parma, Fresh Arugula, Parmigiano-Reggiano, Mozzarella, Olive Oil',
        isActive: true,
        sizes: []
      }
    ];
  }
}

async function getPizzaData() {
  try {
    const [sizes, crusts, sauces, toppings] = await Promise.all([
      prisma.pizzaSize.findMany({
        where: { isActive: true },
        orderBy: { basePrice: 'asc' }
      }),
      prisma.pizzaCrust.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' }
      }),
      prisma.pizzaSauce.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' }
      }),
      prisma.pizzaTopping.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' }
      })
    ]);

    return { sizes, crusts, sauces, toppings };
  } catch (error) {
    console.error('Error fetching pizza data:', error);
    return {
      sizes: [
        { id: '1', name: 'Small', diameter: '10"', basePrice: 0, description: 'Perfect for 1-2 people', isActive: true },
        { id: '2', name: 'Medium', diameter: '12"', basePrice: 3, description: 'Great for 2-3 people', isActive: true },
        { id: '3', name: 'Large', diameter: '14"', basePrice: 6, description: 'Ideal for 3-4 people', isActive: true }
      ],
      crusts: [],
      sauces: [],
      toppings: []
    };
  }
}

export default async function GourmetPizzasPage() {
  const [pizzas, pizzaData] = await Promise.all([
    getSpecialtyPizzas(),
    getPizzaData()
  ]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-orange-800 to-yellow-700"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-600/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-orange-600/20 via-transparent to-transparent"></div>
      
      {/* Floating Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>

      {/* Content */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
              Gourmet <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400">Pizzas</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed mb-8">
              Discover our signature collection of artisan pizzas, crafted with premium ingredients and authentic Italian techniques passed down through generations
            </p>
            
            {/* Quick Action */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/build-pizza"
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all duration-300 hover:scale-105 shadow-lg"
              >
                🎨 Build Your Own Pizza
              </Link>
              <Link 
                href="/menu"
                className="border-2 border-white text-white hover:bg-white hover:text-orange-600 font-bold px-8 py-4 rounded-xl text-lg transition-all duration-300"
              >
                📋 View Full Menu
              </Link>
            </div>
          </div>

          {/* Server-rendered pizza grid with client functionality */}
          <GourmetPizzasClient initialPizzas={pizzas} initialPizzaData={pizzaData} />
        </div>
      </div>
    </div>
  );
}
