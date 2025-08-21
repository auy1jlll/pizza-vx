'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, ShoppingCart, Star, Clock, Info } from 'lucide-react';
import Link from 'next/link';
import MenuItemCustomizer, { 
  CustomizationGroup, 
  CustomizationSelection 
} from '@/components/MenuItemCustomizer';
import SandwichCustomizer from '@/components/SandwichCustomizer';
import SaladCustomizer from '@/components/SaladCustomizer';
import SeafoodCustomizer from '@/components/SeafoodCustomizer';
import DinnerPlateCustomizer from '@/components/DinnerPlateCustomizer';
import { useSexyToast } from '@/components/SexyToastProvider';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  imageUrl?: string;
  isActive: boolean;
  isAvailable: boolean;
  sortOrder: number;
  preparationTime?: number;
  customizationGroups: Array<{
    customizationGroup: CustomizationGroup;
    isRequired: boolean;
    sortOrder: number;
  }>;
}

interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
  isActive: boolean;
  sortOrder: number;
}

interface CategoryMenuData {
  category: MenuCategory;
  items: MenuItem[];
}

interface MenuCategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default function MenuCategoryPage({ params }: MenuCategoryPageProps) {
  const resolvedParams = use(params);
  const { category } = resolvedParams;
  const router = useRouter();
  const toast = useSexyToast();
  
  const [menuData, setMenuData] = useState<CategoryMenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [customizations, setCustomizations] = useState<CustomizationSelection[]>([]);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    fetchMenuData();
    updateCartCount();
  }, [category]);

  useEffect(() => {
    if (selectedItem) {
      calculatePrice();
    }
  }, [selectedItem, customizations]);

  const updateCartCount = () => {
    try {
      const cartItems = JSON.parse(localStorage.getItem('menuCart') || '[]');
      const count = cartItems.reduce((total: number, item: any) => total + (item.quantity || 1), 0);
      setCartItemCount(count);
    } catch {
      setCartItemCount(0);
    }
  };

  const fetchMenuData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/menu/${category}`);
      const result = await response.json();

      if (result.success) {
        setMenuData(result.data);
      } else {
        setError(result.error || 'Failed to load menu');
      }
    } catch (err) {
      setError('Unable to connect to server');
      console.error('Error fetching menu:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculatePrice = async () => {
    if (!selectedItem) return;

    try {
      const response = await fetch('/api/menu/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          menuItemId: selectedItem.id,
          customizations
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setValidationErrors(result.data.validation.errors || []);
        if (result.data.pricing) {
          // Fix floating-point precision issues
          const totalPrice = Math.round(result.data.pricing.totalPrice * 100) / 100;
          setCurrentPrice(totalPrice);
        }
      }
    } catch (err) {
      console.error('Error calculating price:', err);
    }
  };

  const addToCart = async () => {
    if (!selectedItem || validationErrors.length > 0) return;

    try {
      setAddingToCart(true);
      
      const response = await fetch('/api/menu/format-cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          menuItemId: selectedItem.id,
          customizations
        })
      });

      const result = await response.json();
      
      if (result.success) {
        // Create a simplified cart item for menu items
        const menuCartItem = {
          id: `menu-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'menu',
          menuItemId: selectedItem.id,
          name: selectedItem.name, // Fixed: changed from menuItemName to name
          basePrice: selectedItem.basePrice,
          price: Math.round(currentPrice * 100) / 100, // Fix precision and use 'price' field for cart compatibility
          totalPrice: currentPrice, // Keep for backward compatibility
          quantity: 1,
          customizations: result.data.customizations || [],
          categorySlug: category,
          addedAt: new Date()
        };

        // Store in localStorage for now (can be upgraded to context later)
        const existingCart = JSON.parse(localStorage.getItem('menuCart') || '[]');
        existingCart.push(menuCartItem);
        localStorage.setItem('menuCart', JSON.stringify(existingCart));
        
        // Trigger custom event to update cart count
        window.dispatchEvent(new CustomEvent('menuCartUpdated'));
        
        // Close modal and reset
        setSelectedItem(null);
        setCustomizations([]);
        setCurrentPrice(0);
        
        // Show success notification
        showSuccessNotification(`${selectedItem.name} added to cart!`);
        
        // Update cart count
        updateCartCount();
      } else {
        toast.showError('Failed to add item to cart: ' + result.error);
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      toast.showError('Failed to add item to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const showSuccessNotification = (message: string) => {
    // Create a temporary notification element
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300';
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  };

  const selectItem = (item: MenuItem) => {
    setSelectedItem(item);
    setCustomizations([]);
    setCurrentPrice(item.basePrice); // Use dollar value directly
    
    // Set default selections
    const defaultSelections: CustomizationSelection[] = [];
    item.customizationGroups.forEach(itemGroup => {
      const group = itemGroup.customizationGroup;
      const defaultOption = group.options.find(opt => opt.isDefault);
      if (defaultOption) {
        defaultSelections.push({
          customizationOptionId: defaultOption.id,
          quantity: 1
        });
      }
    });
    setCustomizations(defaultSelections);
  };

  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'sandwiches': return '🥪';
      case 'salads': return '🥗';
      case 'seafood': return '🦞';
      case 'dinner-plates': return '🍽️';
      case 'calzones': return '🥟';
      default: return '🍴';
    }
  };

  const getItemIcon = (itemName: string, categorySlug: string) => {
    const name = itemName.toLowerCase();
    
    // Item-specific icons based on name
    if (name.includes('pizza') || name.includes('calzone')) return '🍕';
    if (name.includes('chicken') || name.includes('buffalo')) return '🍗';
    if (name.includes('turkey')) return '🦃';
    if (name.includes('ham')) return '🥓';
    if (name.includes('roast beef') || name.includes('beef')) return '🥩';
    if (name.includes('tuna')) return '🐟';
    if (name.includes('veggie') || name.includes('vegetable')) return '🥬';
    if (name.includes('cheese')) return '🧀';
    if (name.includes('caesar') || name.includes('greek')) return '🥗';
    if (name.includes('shrimp') || name.includes('scallop')) return '🦐';
    if (name.includes('salmon') || name.includes('fish')) return '🐠';
    if (name.includes('lobster') || name.includes('crab')) return '🦞';
    if (name.includes('pasta') || name.includes('spaghetti')) return '🍝';
    if (name.includes('steak')) return '🥩';
    if (name.includes('soup')) return '🍲';
    if (name.includes('wrap')) return '🌯';
    if (name.includes('club')) return '🥪';
    
    // Fall back to category icon
    return getCategoryIcon(categorySlug);
  };

  const getCategoryColor = (slug: string) => {
    switch (slug) {
      case 'sandwiches': return 'from-yellow-600 to-orange-600';
      case 'salads': return 'from-green-600 to-emerald-600';
      case 'seafood': return 'from-blue-600 to-cyan-600';
      case 'dinner-plates': return 'from-purple-600 to-pink-600';
      default: return 'from-gray-600 to-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-orange-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-white text-lg">Loading menu...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !menuData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-orange-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-red-300 text-lg mb-4">Error: {error || 'Menu not found'}</p>
              <button 
                onClick={() => router.push('/menu')}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Back to Menu
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-orange-900">
      {/* Header */}
      <div className={`relative overflow-hidden bg-gradient-to-r ${getCategoryColor(category)}`}>
        <div className="container mx-auto px-4 py-8">
          {/* Cart Indicator */}
          {cartItemCount > 0 && (
            <div className="absolute top-4 right-4">
              <Link href="/cart" className="relative">
                <div className="bg-black/20 hover:bg-black/30 backdrop-blur-sm text-white p-3 rounded-full shadow-lg transition-colors">
                  <ShoppingCart className="w-6 h-6" />
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                    {cartItemCount}
                  </span>
                </div>
              </Link>
            </div>
          )}
          
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={() => router.push('/menu')}
              className="bg-black/20 hover:bg-black/30 backdrop-blur-sm rounded-full p-2 transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-700/50 flex-shrink-0">
              {menuData.category.imageUrl ? (
                <img 
                  src={menuData.category.imageUrl} 
                  alt={menuData.category.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl">
                  {getCategoryIcon(category)}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                {menuData.category.name}
              </h1>
              <p className="text-white/80 text-lg">
                {menuData.category.description}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-white/70">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              <span>Made fresh</span>
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-2" />
              <span>{menuData.items.length} items</span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuData.items
            .filter(item => item.isActive && item.isAvailable)
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((item) => (
              <div
                key={item.id}
                className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden hover:border-white/40 transition-all duration-300 hover:scale-105 shadow-xl"
              >
                {/* Item Details */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">
                        {getItemIcon(item.name, category)}
                      </span>
                      <h3 className="text-lg font-bold text-white leading-tight">{item.name}</h3>
                    </div>
                    <div className="text-right ml-2">
                      <div className="text-lg font-bold text-green-400">
                        ${item.basePrice.toFixed(2)}
                      </div>
                      {item.preparationTime && (
                        <div className="text-xs text-gray-400">
                          ~{item.preparationTime}min
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                    {item.description}
                  </p>

                  {/* Customization Info */}
                  <div className="mb-3">
                    <div className="text-xs text-gray-400 mb-1">
                      {item.customizationGroups.length} customization options available
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {item.customizationGroups.slice(0, 2).map((itemGroup) => (
                        <span
                          key={itemGroup.customizationGroup.id}
                          className="text-xs bg-blue-600/20 text-blue-300 px-2 py-1 rounded border border-blue-600/30"
                        >
                          {itemGroup.customizationGroup.name}
                        </span>
                      ))}
                      {item.customizationGroups.length > 2 && (
                        <span className="text-xs text-gray-400">
                          +{item.customizationGroups.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Add Button */}
                  <button
                    onClick={() => {
                      if (category === 'sandwiches') {
                        router.push(`/build-sandwich?id=${item.id}`);
                      } else {
                        selectItem(item);
                      }
                    }}
                    className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Customize & Add</span>
                  </button>
                </div>
              </div>
            ))}
        </div>

        {menuData.items.length === 0 && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4 opacity-50">
              {getCategoryIcon(category)}
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No items available</h3>
            <p className="text-gray-400">Check back later for new additions to this category.</p>
          </div>
        )}
      </div>

      {/* Customization Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/20">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {selectedItem.name}
                  </h2>
                  <p className="text-gray-300 text-sm mb-3">
                    {selectedItem.description}
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="text-lg font-bold text-green-400">
                      ${currentPrice.toFixed(2)}
                    </div>
                    {selectedItem.preparationTime && (
                      <div className="text-sm text-gray-400 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        ~{selectedItem.preparationTime}min
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Customization Options */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {/* Render appropriate customizer based on category */}
              {category === 'sandwiches' ? (
                <SandwichCustomizer
                  groups={selectedItem.customizationGroups.map(ic => ic.customizationGroup)}
                  selections={customizations}
                  onSelectionsChange={setCustomizations}
                  basePrice={selectedItem.basePrice}
                  disabled={addingToCart}
                />
              ) : category === 'salads' ? (
                <SaladCustomizer
                  groups={selectedItem.customizationGroups.map(ic => ic.customizationGroup)}
                  selections={customizations}
                  onSelectionsChange={setCustomizations}
                  basePrice={selectedItem.basePrice}
                  disabled={addingToCart}
                />
              ) : category === 'seafood' ? (
                <SeafoodCustomizer
                  groups={selectedItem.customizationGroups.map(ic => ic.customizationGroup)}
                  selections={customizations}
                  onSelectionsChange={setCustomizations}
                  basePrice={selectedItem.basePrice}
                  disabled={addingToCart}
                />
              ) : category === 'dinner-plates' ? (
                <DinnerPlateCustomizer
                  menuItemId={selectedItem.id}
                  groups={selectedItem.customizationGroups.map(ic => ic.customizationGroup)}
                  selections={customizations}
                  onSelectionsChange={setCustomizations}
                  basePrice={selectedItem.basePrice}
                  disabled={addingToCart}
                />
              ) : (
                <MenuItemCustomizer
                  groups={selectedItem.customizationGroups.map(ic => ic.customizationGroup)}
                  selections={customizations}
                  onSelectionsChange={setCustomizations}
                  basePrice={selectedItem.basePrice}
                  disabled={addingToCart}
                />
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-white/20">
              <div className="flex space-x-4">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addToCart}
                  disabled={validationErrors.length > 0 || addingToCart}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>
                    {addingToCart ? 'Adding...' : `Add to Cart - $${currentPrice.toFixed(2)}`}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
