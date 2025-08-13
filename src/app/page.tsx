import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            🍕 Pizza Builder Pro
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Create your perfect pizza with our interactive builder
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">Customize Everything</h3>
              <p className="text-gray-600">Choose from multiple sizes, crusts, sauces, and premium toppings</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold mb-2">Real-time Pricing</h3>
              <p className="text-gray-600">See exactly what you&apos;ll pay as you build your pizza</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Quick & Easy</h3>
              <p className="text-gray-600">Intuitive interface makes ordering fast and fun</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <Link 
              href="/pizza-builder"
              className="inline-block bg-red-600 text-white px-8 py-4 rounded-lg font-semibold text-xl hover:bg-red-700 transition-colors shadow-lg"
            >
              Start Building Your Pizza
            </Link>
            
            <div className="text-sm text-gray-500">
              <p>✨ No account required • 🚚 Quick checkout • 💳 Secure payment</p>
            </div>
          </div>
          
          <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Features</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
              <div>
                <h4 className="font-semibold text-gray-700">Pizza Sizes</h4>
                <ul className="text-sm text-gray-600 mt-1">
                  <li>• Small (10&quot;)</li>
                  <li>• Medium (12&quot;)</li>
                  <li>• Large (14&quot;)</li>
                  <li>• Extra Large (16&quot;)</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-700">Crust Options</h4>
                <ul className="text-sm text-gray-600 mt-1">
                  <li>• Thin Crust</li>
                  <li>• Regular Crust</li>
                  <li>• Thick Crust</li>
                  <li>• Stuffed Crust</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-700">Sauce Varieties</h4>
                <ul className="text-sm text-gray-600 mt-1">
                  <li>• Marinara</li>
                  <li>• White Sauce</li>
                  <li>• BBQ Sauce</li>
                  <li>• Spicy Marinara</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-700">Premium Toppings</h4>
                <ul className="text-sm text-gray-600 mt-1">
                  <li>• Fresh Meats</li>
                  <li>• Garden Vegetables</li>
                  <li>• Artisan Cheeses</li>
                  <li>• Specialty Items</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
