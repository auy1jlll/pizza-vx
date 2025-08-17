'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/components/ToastProvider';
import { useSearchParams, useRouter } from 'next/navigation';
import { ChefHat, ShoppingCart, Plus, Minus, ArrowLeft } from 'lucide-react';

interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  sortOrder: number;
}

interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  basePrice: number;
  imageUrl?: string;
  isActive: boolean;
  isAvailable: boolean;
  sortOrder: number;
  preparationTime?: number;
  allergens?: string;
  nutritionInfo?: string;
  category: MenuCategory;
}

interface CustomizationGroup {
  id: string;
  categoryId?: string;
  name: string;
  description?: string;
  type: 'SINGLE_SELECT' | 'MULTI_SELECT' | 'QUANTITY_SELECT' | 'SPECIAL_LOGIC';
  isRequired: boolean;
  minSelections: number;
  maxSelections?: number;
  sortOrder: number;
  isActive: boolean;
  options: CustomizationOption[];
}

interface CustomizationOption {
  id: string;
  groupId: string;
  name: string;
  description?: string;
  priceModifier: number;
  priceType: 'FLAT' | 'PERCENTAGE' | 'PER_UNIT';
  isDefault: boolean;
  isActive: boolean;
  sortOrder: number;
  maxQuantity?: number;
  nutritionInfo?: string;
  allergens?: string;
}

interface SelectedCustomization {
  groupId: string;
  optionId: string;
  quantity: number;
}

interface SandwichCustomizerData {
  menuItem: MenuItem;
  customizationGroups: CustomizationGroup[];
}

export default function SandwichCustomizer() {
  const { show } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [data, setData] = useState<SandwichCustomizerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCustomizations, setSelectedCustomizations] = useState<SelectedCustomization[]>([]);
  const [notes, setNotes] = useState('');
  const [quantity, setQuantity] = useState(1);

  const menuItemId = searchParams.get('id');

  useEffect(() => {
    if (!menuItemId) {
      setError('No menu item specified');
      setLoading(false);
      return;
    }

    loadSandwichData();
  }, [menuItemId]);

  const loadSandwichData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/menu-items/${menuItemId}/customization`);
      
      if (!response.ok) {
        throw new Error(`Failed to load menu item: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to load menu item data');
      }

      setData(result.data);
      
      // Initialize with default selections
      const defaultCustomizations: SelectedCustomization[] = [];
      result.data.customizationGroups.forEach((group: CustomizationGroup) => {
        const defaultOption = group.options.find(option => option.isDefault);
        if (defaultOption && (group.isRequired || group.type === 'SINGLE_SELECT')) {
          defaultCustomizations.push({
            groupId: group.id,
            optionId: defaultOption.id,
            quantity: 1
          });
        }
      });
      
      setSelectedCustomizations(defaultCustomizations);
      
    } catch (error) {
      console.error('Error loading sandwich data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load menu item');
      show('Failed to load menu item data. Please try again.', { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!data) return 0;
    
    let total = data.menuItem.basePrice;
    
    selectedCustomizations.forEach(customization => {
      const group = data.customizationGroups.find(g => g.id === customization.groupId);
      const option = group?.options.find(o => o.id === customization.optionId);
      
      if (option) {
        switch (option.priceType) {
          case 'FLAT':
            total += option.priceModifier * customization.quantity;
            break;
          case 'PERCENTAGE':
            total += (data.menuItem.basePrice * option.priceModifier / 100) * customization.quantity;
            break;
          case 'PER_UNIT':
            total += option.priceModifier * customization.quantity;
            break;
        }
      }
    });
    
    return total * quantity;
  };

  const handleCustomizationChange = (groupId: string, optionId: string, quantity: number = 1) => {
    const group = data?.customizationGroups.find(g => g.id === groupId);
    if (!group) return;

    setSelectedCustomizations(prev => {
      if (group.type === 'SINGLE_SELECT') {
        // Replace any existing selection for this group
        return [
          ...prev.filter(c => c.groupId !== groupId),
          { groupId, optionId, quantity: 1 }
        ];
      } else if (group.type === 'MULTI_SELECT' || group.type === 'QUANTITY_SELECT') {
        const existing = prev.find(c => c.groupId === groupId && c.optionId === optionId);
        
        if (existing) {
          if (quantity <= 0) {
            // Remove the customization
            return prev.filter(c => !(c.groupId === groupId && c.optionId === optionId));
          } else {
            // Update quantity
            return prev.map(c => 
              c.groupId === groupId && c.optionId === optionId 
                ? { ...c, quantity }
                : c
            );
          }
        } else if (quantity > 0) {
          // Add new customization
          return [...prev, { groupId, optionId, quantity }];
        }
      }
      
      return prev;
    });
  };

  const getCustomizationQuantity = (groupId: string, optionId: string): number => {
    const customization = selectedCustomizations.find(
      c => c.groupId === groupId && c.optionId === optionId
    );
    return customization?.quantity || 0;
  };

  const isCustomizationSelected = (groupId: string, optionId: string): boolean => {
    return selectedCustomizations.some(
      c => c.groupId === groupId && c.optionId === optionId
    );
  };

  const generateItemDescription = (): string => {
    if (!data) return '';
    
    const customizationTexts: string[] = [];
    
    selectedCustomizations.forEach(customization => {
      const group = data.customizationGroups.find(g => g.id === customization.groupId);
      const option = group?.options.find(o => o.id === customization.optionId);
      
      if (group && option && !option.isDefault) {
        if (customization.quantity > 1) {
          customizationTexts.push(`${customization.quantity}x ${option.name}`);
        } else {
          customizationTexts.push(option.name);
        }
      }
    });
    
    if (customizationTexts.length > 0) {
      return `${data.menuItem.name} (${customizationTexts.join(', ')})`;
    }
    
    return data.menuItem.name;
  };

  const handleAddToCart = async () => {
    if (!data) return;

    try {
      // Add to localStorage cart for menu items
      const cartItem = {
        id: `sandwich-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'menu',
        menuItemId: data.menuItem.id,
        name: generateItemDescription(),
        basePrice: data.menuItem.basePrice,
        price: calculateTotal() / quantity, // Per item price
        quantity: quantity,
        category: data.menuItem.category.name,
        customizations: selectedCustomizations.map(c => {
          const group = data.customizationGroups.find(g => g.id === c.groupId);
          const option = group?.options.find(o => o.id === c.optionId);
          return {
            groupId: c.groupId,
            groupName: group?.name || '',
            optionId: c.optionId,
            optionName: option?.name || '',
            quantity: c.quantity,
            priceModifier: option?.priceModifier || 0
          };
        }),
        notes: notes.trim() || undefined
      };

      // Save to localStorage
      const existingCart = localStorage.getItem('menuCart');
      const cart = existingCart ? JSON.parse(existingCart) : [];
      cart.push(cartItem);
      localStorage.setItem('menuCart', JSON.stringify(cart));

      show(`Added ${data.menuItem.name} to cart!`, { type: 'success' });

      // Navigate to cart
      router.push('/cart');

    } catch (error) {
      console.error('Error adding to cart:', error);
      show('Failed to add item to cart. Please try again.', { type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <ChefHat className="mx-auto mb-4 animate-pulse" size={48} />
          <p className="text-lg text-gray-600">Loading customization options...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-red-500 mb-4">
            <ChefHat size={48} className="mx-auto" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/menu')}
            className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-full font-semibold hover:from-orange-600 hover:to-amber-600 transition-all duration-300"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Customize Your {data.menuItem.name}</h1>
                <p className="text-gray-600">{data.menuItem.description}</p>
              </div>
            </div>
            
            {/* Price Display */}
            <div className="text-right">
              <div className="text-sm text-gray-500">Total Price</div>
              <div className="text-3xl font-bold text-red-600">${calculateTotal().toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Customization Options */}
          <div className="lg:col-span-2 space-y-6">
            {data.customizationGroups
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((group) => (
                <div key={group.id} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      {group.name}
                      {group.isRequired && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                          Required
                        </span>
                      )}
                    </h3>
                    {group.description && (
                      <p className="text-gray-600 text-sm mt-1">{group.description}</p>
                    )}
                    {group.type === 'MULTI_SELECT' && group.maxSelections && (
                      <p className="text-xs text-gray-500 mt-1">
                        Choose up to {group.maxSelections} options
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {group.options
                      .sort((a, b) => a.sortOrder - b.sortOrder)
                      .map((option) => {
                        const isSelected = isCustomizationSelected(group.id, option.id);
                        const currentQuantity = getCustomizationQuantity(group.id, option.id);
                        
                        return (
                          <div
                            key={option.id}
                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                              isSelected
                                ? 'border-orange-500 bg-orange-50'
                                : 'border-gray-200 hover:border-orange-300'
                            }`}
                            onClick={() => {
                              if (group.type === 'SINGLE_SELECT') {
                                handleCustomizationChange(group.id, option.id, 1);
                              } else if (!isSelected) {
                                handleCustomizationChange(group.id, option.id, 1);
                              }
                            }}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="font-semibold text-gray-800">{option.name}</div>
                                {option.description && (
                                  <div className="text-sm text-gray-600 mt-1">{option.description}</div>
                                )}
                                <div className="text-sm font-medium mt-2">
                                  {option.priceModifier === 0 ? (
                                    <span className="text-green-600">Included</span>
                                  ) : option.priceModifier > 0 ? (
                                    <span className="text-red-600">+${option.priceModifier.toFixed(2)}</span>
                                  ) : (
                                    <span className="text-green-600">${option.priceModifier.toFixed(2)}</span>
                                  )}
                                </div>
                              </div>

                              {/* Quantity Controls for Multi-Select */}
                              {(group.type === 'MULTI_SELECT' || group.type === 'QUANTITY_SELECT') && (
                                <div className="flex items-center gap-2 ml-4">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCustomizationChange(group.id, option.id, Math.max(0, currentQuantity - 1));
                                    }}
                                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                                    disabled={currentQuantity === 0}
                                  >
                                    <Minus size={16} />
                                  </button>
                                  
                                  <span className="w-8 text-center font-semibold">{currentQuantity}</span>
                                  
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const maxQty = option.maxQuantity || 10;
                                      handleCustomizationChange(group.id, option.id, Math.min(maxQty, currentQuantity + 1));
                                    }}
                                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                                  >
                                    <Plus size={16} />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ))}

            {/* Special Instructions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Special Instructions</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special requests or modifications?"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                rows={3}
                maxLength={500}
              />
              <div className="text-xs text-gray-500 mt-1">
                {notes.length}/500 characters
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h3>
              
              {/* Item Image */}
              {data.menuItem.imageUrl && (
                <img
                  src={data.menuItem.imageUrl}
                  alt={data.menuItem.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}

              {/* Item Details */}
              <div className="space-y-3 mb-6">
                <div className="font-semibold text-lg">{generateItemDescription()}</div>
                
                {/* Selected Customizations */}
                {selectedCustomizations.length > 0 && (
                  <div className="space-y-1">
                    {selectedCustomizations.map((customization) => {
                      const group = data.customizationGroups.find(g => g.id === customization.groupId);
                      const option = group?.options.find(o => o.id === customization.optionId);
                      
                      if (!group || !option || option.isDefault) return null;
                      
                      return (
                        <div key={`${customization.groupId}-${customization.optionId}`} className="text-sm text-gray-600 flex justify-between">
                          <span>
                            {customization.quantity > 1 ? `${customization.quantity}x ` : ''}{option.name}
                          </span>
                          {option.priceModifier !== 0 && (
                            <span>
                              {option.priceModifier > 0 ? '+' : ''}${(option.priceModifier * customization.quantity).toFixed(2)}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center justify-between mb-6">
                <span className="font-semibold">Quantity:</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Base Price:</span>
                  <span>${data.menuItem.basePrice.toFixed(2)}</span>
                </div>
                
                {selectedCustomizations.length > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Customizations:</span>
                    <span>${((calculateTotal() / quantity) - data.menuItem.basePrice).toFixed(2)}</span>
                  </div>
                )}
                
                {quantity > 1 && (
                  <div className="flex justify-between text-sm">
                    <span>Quantity ({quantity}x):</span>
                    <span>${(calculateTotal() / quantity).toFixed(2)} each</span>
                  </div>
                )}
                
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-red-600">${calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full mt-6 bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 rounded-full font-semibold text-lg hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
              >
                <ShoppingCart size={20} />
                Add to Cart - ${calculateTotal().toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
