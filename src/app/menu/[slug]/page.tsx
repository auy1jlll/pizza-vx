'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Minus, ShoppingCart, Clock, DollarSign } from 'lucide-react';
import { useParams } from 'next/navigation';

interface CustomizationOption {
  id: string;
  name: string;
  priceModifier: number;
  isDefault: boolean;
}

interface CustomizationGroup {
  id: string;
  name: string;
  type: 'SINGLE_SELECT' | 'MULTI_SELECT' | 'QUANTITY' | 'TOGGLE';
  isRequired: boolean;
  maxSelections?: number;
  options: CustomizationOption[];
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  imageUrl?: string;
  customizationGroups: CustomizationGroup[];
}

interface CategoryData {
  id: string;
  name: string;
  slug: string;
  description: string;
  menuItems: MenuItem[];
}

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [categoryData, setCategoryData] = useState<CategoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [selectedItems, setSelectedItems] = useState<{[key: string]: any}>({});

  useEffect(() => {
    fetchCategoryData();
    updateCartCount();
    
    // Listen for cart updates
    const handleStorageChange = () => updateCartCount();
    window.addEventListener('storage', handleStorageChange);
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [slug]);

  const updateCartCount = () => {
    try {
      const cartItems = JSON.parse(localStorage.getItem('menuCart') || '[]');
      const count = cartItems.reduce((total: number, item: any) => total + (item.quantity || 1), 0);
      setCartItemCount(count);
    } catch {
      setCartItemCount(0);
    }
  };

  const fetchCategoryData = async () => {
    if (!slug) return;
    
    try {
      const response = await fetch(`/api/menu/categories?category=${slug}`);
      const result = await response.json();

      if (result.success) {
        setCategoryData(result.data);
      } else {
        setError(result.error || 'Failed to load category');
      }
    } catch (err) {
      setError('Failed to load category data');
      console.error('Error fetching category:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCustomizationPrice = (itemId: string, customizations: {[groupId: string]: any}): number => {
    if (!categoryData || !categoryData.menuItems) return 0;
    
    const item = categoryData.menuItems.find(item => item.id === itemId);
    if (!item || !item.customizationGroups) return 0;

    let additionalPrice = 0;
    
    Object.entries(customizations).forEach(([groupId, selections]) => {
      const group = item.customizationGroups.find(g => g.id === groupId);
      if (!group || !group.options) return;

      if (group.type === 'SINGLE_SELECT') {
        const option = group.options.find(opt => opt.id === selections);
        if (option) additionalPrice += option.priceModifier;
      } else if (group.type === 'MULTI_SELECT') {
        selections.forEach((selectionId: string) => {
          const option = group.options.find(opt => opt.id === selectionId);
          if (option) additionalPrice += option.priceModifier;
        });
      } else if (group.type === 'QUANTITY') {
        Object.entries(selections).forEach(([optionId, quantity]) => {
          const option = group.options.find(opt => opt.id === optionId);
          if (option && typeof quantity === 'number') {
            additionalPrice += option.priceModifier * quantity;
          }
        });
      }
    });

    return additionalPrice;
  };

  const addToCart = (item: MenuItem, customizations: {[groupId: string]: any}, quantity: number = 1) => {
    try {
      const cartItems = JSON.parse(localStorage.getItem('menuCart') || '[]');
      const additionalPrice = getCustomizationPrice(item.id, customizations);
      const totalPrice = item.basePrice + additionalPrice;

      const cartItem = {
        id: `${item.id}_${Date.now()}`,
        menuItemId: item.id,
        name: item.name,
        price: totalPrice, // Use price field for cart compatibility
        basePrice: item.basePrice,
        customizations,
        customizationPrice: additionalPrice,
        totalPrice,
        quantity,
        addedAt: new Date().toISOString()
      };

      cartItems.push(cartItem);
      localStorage.setItem('menuCart', JSON.stringify(cartItems));
      updateCartCount();
      
      // Show success feedback
      alert(`Added ${item.name} to cart!`);
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Failed to add item to cart');
    }
  };

  const handleQuickAdd = (item: MenuItem) => {
    if (item.customizationGroups.length > 0) {
      // If item has customizations, show in selected items for customization
      setSelectedItems({
        ...selectedItems,
        [item.id]: {
          item,
          quantity: 1,
          customizations: {}
        }
      });
    } else {
      // If no customizations, add directly to cart
      addToCart(item, {}, 1);
    }
  };

  const updateItemCustomization = (itemId: string, groupId: string, value: any) => {
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        customizations: {
          ...prev[itemId]?.customizations,
          [groupId]: value
        }
      }
    }));
  };

  const updateItemQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      const { [itemId]: removed, ...rest } = selectedItems;
      setSelectedItems(rest);
    } else {
      setSelectedItems(prev => ({
        ...prev,
        [itemId]: {
          ...prev[itemId],
          quantity
        }
      }));
    }
  };

  const confirmAddToCart = (itemId: string) => {
    const selectedItem = selectedItems[itemId];
    if (selectedItem) {
      addToCart(selectedItem.item, selectedItem.customizations, selectedItem.quantity);
      const { [itemId]: removed, ...rest } = selectedItems;
      setSelectedItems(rest);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🍽️</div>
          <div className="text-white text-xl">Loading menu...</div>
        </div>
      </div>
    );
  }

  if (error || !categoryData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 opacity-50">😞</div>
          <h1 className="text-2xl font-bold text-white mb-4">Category Not Found</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link 
            href="/menu"
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Back to Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-black/20 border-b border-gray-700 sticky top-0 backdrop-blur-sm z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/menu"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft size={24} />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">{categoryData.name}</h1>
                <p className="text-gray-400">{categoryData.description}</p>
              </div>
            </div>
            
            <Link 
              href="/cart"
              className="relative bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <ShoppingCart size={20} />
              <span>Cart</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {categoryData.menuItems && categoryData.menuItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryData.menuItems.map((item) => {
              const selectedItem = selectedItems[item.id];
              const isCustomizing = !!selectedItem;
              const customizationPrice = isCustomizing ? getCustomizationPrice(item.id, selectedItem.customizations) : 0;
              const totalPrice = item.basePrice + customizationPrice;

              return (
                <div key={item.id} className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 hover:border-gray-600 transition-all">
                  {/* Item Image */}
                  {item.imageUrl && (
                    <div className="aspect-video bg-gray-700 overflow-hidden">
                      <img 
                        src={item.imageUrl} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  {/* Item Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-2">{item.name}</h3>
                    <p className="text-gray-400 text-sm mb-4">{item.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <DollarSign size={16} className="text-green-400" />
                        <span className="text-lg font-semibold text-white">
                          ${isCustomizing ? totalPrice.toFixed(2) : item.basePrice.toFixed(2)}
                        </span>
                        {isCustomizing && customizationPrice > 0 && (
                          <span className="text-sm text-green-400">
                            (+${customizationPrice.toFixed(2)})
                          </span>
                        )}
                      </div>
                      
                      {!isCustomizing ? (
                        <button
                          onClick={() => handleQuickAdd(item)}
                          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                        >
                          <Plus size={16} />
                          <span>Add</span>
                        </button>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateItemQuantity(item.id, selectedItem.quantity - 1)}
                            className="bg-gray-600 hover:bg-gray-700 text-white w-8 h-8 rounded-lg flex items-center justify-center"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="text-white w-8 text-center">{selectedItem.quantity}</span>
                          <button
                            onClick={() => updateItemQuantity(item.id, selectedItem.quantity + 1)}
                            className="bg-gray-600 hover:bg-gray-700 text-white w-8 h-8 rounded-lg flex items-center justify-center"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Customization Groups */}
                    {isCustomizing && item.customizationGroups && item.customizationGroups.map((group) => (
                      <div key={group.id} className="mb-4 p-4 bg-gray-900/50 rounded-lg">
                        <h4 className="text-white font-medium mb-2">
                          {group.name} {group.isRequired && <span className="text-red-400">*</span>}
                        </h4>
                        
                        {group.type === 'SINGLE_SELECT' && group.options && (
                          <div className="space-y-2">
                            {group.options.map((option) => (
                              <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="radio"
                                  name={`${item.id}_${group.id}`}
                                  value={option.id}
                                  checked={selectedItem.customizations[group.id] === option.id}
                                  onChange={(e) => updateItemCustomization(item.id, group.id, e.target.value)}
                                  className="text-orange-600"
                                />
                                <span className="text-gray-300 flex-1">{option.name}</span>
                                {option.priceModifier !== 0 && (
                                  <span className="text-sm text-green-400">
                                    {option.priceModifier > 0 ? '+' : ''}${option.priceModifier.toFixed(2)}
                                  </span>
                                )}
                              </label>
                            ))}
                          </div>
                        )}

                        {group.type === 'MULTI_SELECT' && group.options && (
                          <div className="space-y-2">
                            {group.options.map((option) => (
                              <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={(selectedItem.customizations[group.id] || []).includes(option.id)}
                                  onChange={(e) => {
                                    const current = selectedItem.customizations[group.id] || [];
                                    const updated = e.target.checked
                                      ? [...current, option.id]
                                      : current.filter((id: string) => id !== option.id);
                                    updateItemCustomization(item.id, group.id, updated);
                                  }}
                                  className="text-orange-600"
                                />
                                <span className="text-gray-300 flex-1">{option.name}</span>
                                {option.priceModifier !== 0 && (
                                  <span className="text-sm text-green-400">
                                    {option.priceModifier > 0 ? '+' : ''}${option.priceModifier.toFixed(2)}
                                  </span>
                                )}
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Add to Cart Button */}
                    {isCustomizing && (
                      <button
                        onClick={() => confirmAddToCart(item.id)}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
                      >
                        <ShoppingCart size={16} />
                        <span>Add to Cart - ${(totalPrice * selectedItem.quantity).toFixed(2)}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4 opacity-50">🍽️</div>
            <h3 className="text-xl font-semibold text-white mb-2">No items available</h3>
            <p className="text-gray-400 mb-6">This category doesn't have any menu items yet.</p>
            <Link 
              href="/menu"
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Browse Other Categories
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
