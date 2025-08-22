'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, ShoppingCart, Star, Clock, Info } from 'lucide-react';
import Link from 'next/link';
import { designSystem, components, animations, responsive } from '../../../lib/design-system';
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
    setCurrentPrice(item.basePrice);
    setValidationErrors([]); // Clear validation errors immediately
    
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

  // Helper function to determine if the button should be disabled
  const isButtonDisabled = () => {
    if (addingToCart) return true;
    
    // If there are validation errors, check if they're real errors or just initial state
    if (validationErrors.length > 0) {
      // For items with no required customizations (like salads), ignore validation errors
      const hasRequiredCustomizations = selectedItem?.customizationGroups.some(
        itemGroup => itemGroup.isRequired
      );
      if (!hasRequiredCustomizations) {
        return false; // Don't disable for optional customizations
      }
      return true; // Disable if there are required customizations with errors
    }
    
    return false; // Enable by default
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
              <h1 className={`${designSystem.h1} text-white`}>
                {menuData.category.name}
              </h1>
              <p className={`${designSystem.bodyLarge} text-white/80`}>
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

      {/* Menu Items - Enhanced Grid */}
      <div className="container mx-auto px-4 py-12">
        {/* Grid with Enhanced Spacing */}
        <div className={`${responsive.grid.desktop}`}>
          {menuData.items
            .filter(item => item.isActive && item.isAvailable)
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((item, index) => (
              <div
                key={item.id}
                className={`${components.card.interactive} ${animations.fadeIn}`}
                style={animations.staggered(index)}
              >
                {/* Floating Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Floating Item Icon - Large */}
                <div className={`${components.icon.floating} absolute top-4 right-4`}>
                  {getItemIcon(item.name, category)}
                </div>

                {/* Content */}
                <div className="relative z-10 p-6">
                  {/* Header with Icon Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Icon Badge */}
                      <div className={`${components.icon.badge}`}>
                        {getItemIcon(item.name, category)}
                      </div>
                      
                      {/* Title & Description */}
                      <div className="flex-1 min-w-0">
                        <h3 className={`${designSystem.h3} text-white leading-tight mb-2 group-hover:text-orange-300 transition-colors duration-300`}>
                          {item.name}
                        </h3>
                        <p className={`${designSystem.small} text-white/70 leading-relaxed line-clamp-2 group-hover:text-white/90 transition-colors duration-300`}>
                          {item.description}
                        </p>
                      </div>
                    </div>
                    
                    {/* Price & Time Badge */}
                    <div className="text-right ml-4">
                      <div className="inline-flex items-center px-3 py-2 rounded-xl bg-green-500/20 backdrop-blur-sm border border-green-500/30 mb-2">
                        <span className={`${designSystem.bodyLarge} font-bold text-green-300`}>
                          ${item.basePrice.toFixed(2)}
                        </span>
                      </div>
                      {item.preparationTime && (
                        <div className={`${designSystem.tiny} flex items-center text-white/60`}>
                          <Clock className="w-3 h-3 mr-1" />
                          {item.preparationTime}min
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Customization Pills - Enhanced */}
                  <div className="mb-6">
                    {item.customizationGroups.length > 0 && (
                      <>
                        <div className={`${designSystem.tiny} flex items-center text-white/60 mb-3`}>
                          <Info className="w-3 h-3 mr-1" />
                          <span>{item.customizationGroups.length} customization option{item.customizationGroups.length !== 1 ? 's' : ''} available</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {item.customizationGroups.slice(0, 2).map((itemGroup) => (
                            <span
                              key={itemGroup.customizationGroup.id}
                              className={`${designSystem.tiny} inline-flex items-center px-3 py-1.5 rounded-full bg-blue-500/15 backdrop-blur-sm border border-blue-500/25 text-blue-300 font-medium hover:scale-105 transition-transform duration-200 shadow-sm`}
                            >
                              {itemGroup.customizationGroup.name}
                            </span>
                          ))}
                          {item.customizationGroups.length > 2 && (
                            <span className={`${designSystem.tiny} inline-flex items-center px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/60 font-medium`}>
                              +{item.customizationGroups.length - 2} more
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Enhanced CTA Button */}
                  <button
                    onClick={() => {
                      if (category === 'sandwiches') {
                        router.push(`/build-sandwich?id=${item.id}`);
                      } else {
                        selectItem(item);
                      }
                    }}
                    className={`${components.button.shimmer} w-full py-4 px-6`}
                  >
                    {/* Button Background Animation */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
                    
                    <div className="relative flex items-center justify-center space-x-3">
                      <Plus className="w-5 h-5 group-hover/btn:rotate-90 transition-transform duration-300" />
                      <span className={`${designSystem.bodyLarge} font-semibold`}>Customize & Add</span>
                    </div>
                  </button>
                </div>

                {/* Floating Corner Accent */}
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-500/10 to-transparent rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            ))}
        </div>

        {menuData.items.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <div className="relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-12 max-w-md mx-auto text-center">
              {/* Floating Background Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-500/10 rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-500/30 flex items-center justify-center text-4xl mb-6 mx-auto">
                  {getCategoryIcon(category)}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Coming Soon!</h3>
                <p className="text-white/70 leading-relaxed">
                  We're working on adding delicious items to this category. Check back soon for new additions!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Customization Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with no pointer events */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md pointer-events-none"></div>
          
          {/* Modal content with pointer events enabled */}
          <div className="relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 max-w-lg w-full max-h-[90vh] shadow-2xl pointer-events-auto">
            {/* Floating Background Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-500/10 rounded-full blur-3xl"></div>
            
            {/* Modal Header */}
            <div className="relative z-10 p-4 border-b border-white/20">
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-500/30 flex items-center justify-center text-2xl">
                    {getItemIcon(selectedItem.name, category)}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-white mb-1">
                      {selectedItem.name}
                    </h2>
                    <p className="text-white/70 text-sm leading-relaxed mb-2">
                      {selectedItem.description}
                    </p>
                    <div className="flex items-center space-x-3">
                      <div className="inline-flex items-center px-3 py-1 rounded-lg bg-green-500/20 backdrop-blur-sm border border-green-500/30">
                        <span className="text-lg font-bold text-green-300">
                          ${currentPrice.toFixed(2)}
                        </span>
                      </div>
                      {selectedItem.preparationTime && (
                        <div className="flex items-center text-xs text-white/60">
                          <Clock className="w-3 h-3 mr-1" />
                          <span>~{selectedItem.preparationTime}min</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white/70 hover:text-white hover:bg-white/20 transition-all duration-200 flex items-center justify-center ml-3"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Customization Options */}
            <div className="p-4 overflow-y-auto max-h-[40vh]">
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
            <div className="p-4 border-t border-white/20">
              <div className="flex space-x-3">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addToCart}
                  disabled={addingToCart}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
                  style={{
                    backgroundColor: '#16a34a !important',
                    background: 'linear-gradient(to right, #16a34a, #15803d) !important',
                    border: '2px solid #22c55e',
                    minHeight: '48px',
                    zIndex: 999
                  }}
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
