'use client';

export default function HeroPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      {/* NAVIGATION PLACEHOLDER */}
      <nav className="bg-gray-100 border-2 border-dashed border-gray-400 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-block bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-600 mb-2">🧭 NAVIGATION PLACEHOLDER</h3>
              <p className="text-sm text-gray-500">Menu pages links will go here:</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs">📋 Menu</span>
                <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs">🍕 Pizzas</span>
                <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs">🥗 Salads</span>
                <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs">🍝 Pasta</span>
                <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs">🥤 Drinks</span>
                <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs">🛒 Cart</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                {/* Large Logo Placeholder */}
                <div className="mb-8 flex justify-center lg:justify-start">
                  <div className="w-32 h-32 bg-gradient-to-br from-red-500 via-orange-500 to-green-500 rounded-2xl flex items-center justify-center shadow-2xl">
                    <span className="text-white font-bold text-3xl">LOGO</span>
                  </div>
                </div>
                
                {/* TITLE PLACEHOLDER */}
                <div className="bg-gray-100 border-2 border-dashed border-gray-400 p-6 rounded-lg mb-6">
                  <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-600 mb-2">📝 TITLE PLACEHOLDER</h2>
                    <p className="text-sm text-gray-500">Main headline and business name will go here</p>
                    <div className="mt-3 space-y-2">
                      <div className="h-8 bg-red-200 rounded-md flex items-center justify-center">
                        <span className="text-red-600 text-sm font-medium">Welcome Message Line</span>
                      </div>
                      <div className="h-10 bg-orange-200 rounded-md flex items-center justify-center">
                        <span className="text-orange-600 text-lg font-semibold">Business Name Display</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Experience the finest authentic Italian pizzas made with fresh ingredients and traditional recipes. 
                  From classic Margherita to gourmet specialties, every bite is a taste of perfection.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <button className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 md:py-4 md:text-lg md:px-10 transition-colors">
                      View Menu
                    </button>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <button className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 md:py-4 md:text-lg md:px-10 transition-colors">
                      Order Online
                    </button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="h-56 w-full bg-gradient-to-br from-orange-400 to-red-500 sm:h-72 md:h-96 lg:w-full lg:h-full flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-64 h-64 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <span className="text-4xl font-bold">🍕</span>
              </div>
              <p className="mt-4 text-xl font-semibold">Delicious Pizza Awaits</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-red-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Why Choose Omar Pizza?
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              {/* Feature 1 */}
              <div className="relative bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-red-500 text-white">
                  <span className="text-xl">🔥</span>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Fresh Ingredients</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  We use only the freshest, locally-sourced ingredients for the best taste.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="relative bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white">
                  <span className="text-xl">⚡</span>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Fast Delivery</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Hot, fresh pizza delivered to your door in 30 minutes or less.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="relative bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
                  <span className="text-xl">⭐</span>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Quality Guaranteed</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  100% satisfaction guaranteed or your money back.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-red-600 via-orange-600 to-green-600">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to order?</span>
            <span className="block">Start building your perfect pizza today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-red-100">
            Join thousands of satisfied customers who trust Omar Pizza for their favorite meals.
          </p>
          <button className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-red-600 bg-white hover:bg-red-50 sm:w-auto transition-colors">
            Order Now
          </button>
        </div>
      </section>

      {/* FOOTER PLACEHOLDER */}
      <footer className="bg-gray-100 border-2 border-dashed border-gray-400 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-block bg-white p-6 rounded-lg shadow-md max-w-4xl">
              <h3 className="text-xl font-semibold text-gray-600 mb-4">🦶 FOOTER PLACEHOLDER</h3>
              <p className="text-sm text-gray-500 mb-4">Footer elements will be organized here:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                {/* Contact Info Placeholder */}
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-600 mb-2">📞 Contact Info</h4>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div>Phone Number</div>
                    <div>Email Address</div>
                    <div>Physical Address</div>
                  </div>
                </div>
                
                {/* Business Hours Placeholder */}
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-600 mb-2">🕒 Business Hours</h4>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div>Mon-Thu: Hours</div>
                    <div>Fri-Sat: Hours</div>
                    <div>Sunday: Hours</div>
                  </div>
                </div>
                
                {/* Social Media Placeholder */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-600 mb-2">📱 Social Media</h4>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div>Facebook Link</div>
                    <div>Instagram Link</div>
                    <div>Twitter Link</div>
                  </div>
                </div>
                
                {/* Legal Links Placeholder */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-600 mb-2">⚖️ Legal</h4>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div>Privacy Policy</div>
                    <div>Terms of Service</div>
                    <div>Refund Policy</div>
                  </div>
                </div>
              </div>
              
              {/* Copyright Placeholder */}
              <div className="border-t-2 border-dashed border-gray-300 pt-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-xs text-gray-500">© Copyright Text Placeholder</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
