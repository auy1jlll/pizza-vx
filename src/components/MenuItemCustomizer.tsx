'use client';

import { useState, useEffect } from 'react';
import { Plus, Minus, Check, X, Info } from 'lucide-react';

export interface CustomizationOption {
  id: string;
  name: string;
  description?: string;
  priceModifier: number;
  priceType: 'FLAT' | 'PERCENTAGE' | 'PER_UNIT';
  isDefault: boolean;
  isActive: boolean;
  sortOrder: number;
  maxQuantity?: number;
}

export interface CustomizationGroup {
  id: string;
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

export interface CustomizationSelection {
  customizationOptionId: string;
  quantity?: number;
}

interface MenuItemCustomizerProps {
  groups: CustomizationGroup[];
  selections: CustomizationSelection[];
  onSelectionsChange: (selections: CustomizationSelection[]) => void;
  basePrice: number;
  disabled?: boolean;
}

export default function MenuItemCustomizer({
  groups,
  selections,
  onSelectionsChange,
  basePrice,
  disabled = false
}: MenuItemCustomizerProps) {
  const [errors, setErrors] = useState<string[]>([]);

  // Update selections for a specific option
  const updateSelection = (optionId: string, quantity?: number) => {
    const newSelections = [...selections];
    const existingIndex = newSelections.findIndex(s => s.customizationOptionId === optionId);

    if (quantity === undefined || quantity === 0) {
      // Remove selection
      if (existingIndex >= 0) {
        newSelections.splice(existingIndex, 1);
      }
    } else {
      // Add or update selection
      if (existingIndex >= 0) {
        newSelections[existingIndex].quantity = quantity;
      } else {
        newSelections.push({ customizationOptionId: optionId, quantity });
      }
    }

    onSelectionsChange(newSelections);
  };

  // Handle single select (radio button behavior)
  const handleSingleSelect = (group: CustomizationGroup, optionId: string) => {
    if (disabled) return;

    const newSelections = [...selections];
    
    // Remove any existing selections from this group
    const groupOptionIds = group.options.map(opt => opt.id);
    for (let i = newSelections.length - 1; i >= 0; i--) {
      if (groupOptionIds.includes(newSelections[i].customizationOptionId)) {
        newSelections.splice(i, 1);
      }
    }

    // Add the new selection
    newSelections.push({ customizationOptionId: optionId, quantity: 1 });
    onSelectionsChange(newSelections);
  };

  // Handle multi select (checkbox behavior)
  const handleMultiSelect = (group: CustomizationGroup, optionId: string) => {
    if (disabled) return;

    const isSelected = selections.some(s => s.customizationOptionId === optionId);
    
    if (isSelected) {
      updateSelection(optionId, 0);
    } else {
      // Check max selections limit
      const groupOptionIds = group.options.map(opt => opt.id);
      const currentGroupSelections = selections.filter(s => 
        groupOptionIds.includes(s.customizationOptionId)
      );

      if (group.maxSelections && currentGroupSelections.length >= group.maxSelections) {
        return; // Don't allow more selections
      }

      updateSelection(optionId, 1);
    }
  };

  // Handle quantity select
  const handleQuantitySelect = (optionId: string, newQuantity: number) => {
    if (disabled) return;

    updateSelection(optionId, newQuantity);
  };

  // Handle special logic (dinner plate sides)
  const handleSpecialLogic = (group: CustomizationGroup, optionId: string) => {
    if (disabled) return;

    const groupOptionIds = group.options.map(opt => opt.id);
    const currentGroupSelections = selections.filter(s => 
      groupOptionIds.includes(s.customizationOptionId)
    );

    const isSelected = selections.some(s => s.customizationOptionId === optionId);

    if (isSelected) {
      updateSelection(optionId, 0);
    } else {
      // For dinner plates "2 of 3" logic
      if (group.name.includes('2 of 3') && currentGroupSelections.length >= 2) {
        return; // Don't allow more than 2 selections
      }

      updateSelection(optionId, 1);
    }
  };

  // Get selection quantity for an option
  const getSelectionQuantity = (optionId: string): number => {
    const selection = selections.find(s => s.customizationOptionId === optionId);
    return selection?.quantity || 0;
  };

  // Check if option is selected
  const isOptionSelected = (optionId: string): boolean => {
    return selections.some(s => s.customizationOptionId === optionId);
  };

  // Calculate price for an option
  const calculateOptionPrice = (option: CustomizationOption, quantity: number = 1): number => {
    switch (option.priceType) {
      case 'FLAT':
        return option.priceModifier * quantity;
      case 'PERCENTAGE':
        return (basePrice * option.priceModifier / 100) * quantity;
      case 'PER_UNIT':
        return option.priceModifier * quantity;
      default:
        return 0;
    }
  };

  // Format price display
  const formatPrice = (price: number): string => {
    if (price === 0) return '';
    if (price > 0) return `+$${price.toFixed(2)}`;
    return `-$${Math.abs(price).toFixed(2)}`;
  };

  // Validate current selections
  useEffect(() => {
    const newErrors: string[] = [];

    groups.forEach(group => {
      const groupOptionIds = group.options.map(opt => opt.id);
      const groupSelections = selections.filter(s => 
        groupOptionIds.includes(s.customizationOptionId)
      );

      // Check required groups
      if (group.isRequired && groupSelections.length === 0) {
        newErrors.push(`${group.name} is required`);
      }

      // Check minimum selections
      if (group.minSelections > 0 && groupSelections.length < group.minSelections) {
        newErrors.push(`${group.name} requires at least ${group.minSelections} selection${group.minSelections > 1 ? 's' : ''}`);
      }

      // Check maximum selections
      if (group.maxSelections && groupSelections.length > group.maxSelections) {
        newErrors.push(`${group.name} allows maximum ${group.maxSelections} selection${group.maxSelections > 1 ? 's' : ''}`);
      }

      // Special logic for dinner plates
      if (group.type === 'SPECIAL_LOGIC' && group.name.includes('2 of 3')) {
        if (groupSelections.length === 1) {
          newErrors.push('Please select one more side (2 of 3 required)');
        } else if (groupSelections.length > 2) {
          newErrors.push('Too many sides selected (only 2 of 3 allowed)');
        }
      }
    });

    setErrors(newErrors);
  }, [groups, selections]);

  const renderOption = (group: CustomizationGroup, option: CustomizationOption) => {
    const isSelected = isOptionSelected(option.id);
    const quantity = getSelectionQuantity(option.id);
    const price = calculateOptionPrice(option, quantity);

    const handleOptionClick = () => {
      if (disabled) return;
      
      if (group.type === 'SINGLE_SELECT') {
        handleSingleSelect(group, option.id);
      } else if (group.type === 'MULTI_SELECT') {
        handleMultiSelect(group, option.id);
      } else if (group.type === 'SPECIAL_LOGIC') {
        handleSpecialLogic(group, option.id);
      }
    };

    return (
      <div
        key={option.id}
        onClick={handleOptionClick}
        className={`
          relative p-3 rounded-lg border transition-all duration-200
          ${isSelected 
            ? 'border-green-500 bg-green-50/10 shadow-lg' 
            : 'border-gray-600 bg-black/20 hover:border-gray-500'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <div className="flex items-center space-x-3">
          {/* Selection Indicator */}
          {group.type === 'SINGLE_SELECT' && (
            <div 
              className={`
                w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                ${isSelected ? 'border-green-500 bg-green-500' : 'border-gray-400'}
              `}
            >
              {isSelected && <Check className="w-3 h-3 text-white" />}
            </div>
          )}

          {(group.type === 'MULTI_SELECT' || group.type === 'SPECIAL_LOGIC') && (
            <div 
              className={`
                w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0
                ${isSelected ? 'border-green-500 bg-green-500' : 'border-gray-400'}
              `}
            >
              {isSelected && <Check className="w-3 h-3 text-white" />}
            </div>
          )}

          {/* Option Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-white text-sm truncate">{option.name}</h4>
                {option.description && (
                  <p className="text-xs text-gray-400 mt-1">{option.description}</p>
                )}
              </div>
              
              {/* Price Display */}
              {price !== 0 && (
                <div className={`font-semibold text-sm ml-2 ${price > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatPrice(price)}
                </div>
              )}
              
              {option.isDefault && (
                <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded ml-2 flex-shrink-0">
                  Default
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quantity Controls for QUANTITY_SELECT */}
        {group.type === 'QUANTITY_SELECT' && isSelected && (
          <div className="mt-3 pt-3 border-t border-gray-600">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Quantity:</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuantitySelect(option.id, Math.max(0, quantity - 1));
                  }}
                  className="w-8 h-8 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center"
                  disabled={disabled || quantity <= 1}
                >
                  <Minus className="w-4 h-4 text-white" />
                </button>
                <span className="w-8 text-center text-white font-medium">{quantity}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuantitySelect(option.id, quantity + 1);
                  }}
                  className="w-8 h-8 rounded-full bg-green-600 hover:bg-green-700 flex items-center justify-center"
                  disabled={disabled || !!(option.maxQuantity && quantity >= option.maxQuantity)}
                >
                  <Plus className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quantity Select for non-quantity groups */}
        {group.type !== 'QUANTITY_SELECT' && isSelected && option.maxQuantity && option.maxQuantity > 1 && (
          <div className="mt-3 pt-3 border-t border-gray-600">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Quantity:</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateSelection(option.id, Math.max(1, quantity - 1));
                  }}
                  className="w-6 h-6 rounded bg-red-600 hover:bg-red-700 flex items-center justify-center"
                  disabled={disabled || quantity <= 1}
                >
                  <Minus className="w-3 h-3 text-white" />
                </button>
                <span className="w-6 text-center text-white text-sm">{quantity}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateSelection(option.id, quantity + 1);
                  }}
                  className="w-6 h-6 rounded bg-green-600 hover:bg-green-700 flex items-center justify-center"
                  disabled={disabled || quantity >= option.maxQuantity}
                >
                  <Plus className="w-3 h-3 text-white" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Check if we have both Sandwich Toppings and Sandwich Condiments groups */}
      {(() => {
        const toppingsGroup = groups.find(g => g.name === 'Sandwich Toppings');
        const condimentsGroup = groups.find(g => g.name === 'Sandwich Condiments');
        
        if (toppingsGroup && condimentsGroup) {
          // Render 2-column layout for sandwich customization
          return (
            <div className="space-y-6">
              {/* Combined Header */}
              <div className="text-center">
                <h2 className="text-xl font-bold text-white mb-2">Customize Your Sandwich</h2>
                <p className="text-gray-400 text-sm">Choose up to 5 toppings and up to 5 condiments</p>
              </div>
              
              {/* 2-Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Toppings */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                        <span>🥬 {toppingsGroup.name}</span>
                        {toppingsGroup.isRequired && (
                          <span className="text-red-400 text-sm">*</span>
                        )}
                      </h3>
                      {toppingsGroup.description && (
                        <p className="text-sm text-gray-400 mt-1">{toppingsGroup.description}</p>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-400">
                      {toppingsGroup.maxSelections && (
                        <span>Max {toppingsGroup.maxSelections}</span>
                      )}
                    </div>
                  </div>

                  {/* Toppings Options */}
                  <div className="grid grid-cols-1 gap-3">
                    {toppingsGroup.options
                      .filter(option => option.isActive)
                      .sort((a, b) => a.sortOrder - b.sortOrder)
                      .map((option) => renderOption(toppingsGroup, option))
                    }
                  </div>
                </div>

                {/* Right Column - Condiments */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                        <span>🍯 {condimentsGroup.name}</span>
                        {condimentsGroup.isRequired && (
                          <span className="text-red-400 text-sm">*</span>
                        )}
                      </h3>
                      {condimentsGroup.description && (
                        <p className="text-sm text-gray-400 mt-1">{condimentsGroup.description}</p>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-400">
                      {condimentsGroup.maxSelections && (
                        <span>Max {condimentsGroup.maxSelections}</span>
                      )}
                    </div>
                  </div>

                  {/* Condiments Options */}
                  <div className="grid grid-cols-1 gap-3">
                    {condimentsGroup.options
                      .filter(option => option.isActive)
                      .sort((a, b) => a.sortOrder - b.sortOrder)
                      .map((option) => renderOption(condimentsGroup, option))
                    }
                  </div>
                </div>
              </div>
              
              {/* Render any other groups below the 2-column layout */}
              {groups
                .filter(group => group.name !== 'Sandwich Toppings' && group.name !== 'Sandwich Condiments')
                .map((group) => (
                  <div key={group.id} className="space-y-4">
                    {/* Group Header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                          <span>{group.name}</span>
                          {group.isRequired && (
                            <span className="text-red-400 text-sm">*</span>
                          )}
                        </h3>
                        {group.description && (
                          <p className="text-sm text-gray-400 mt-1">{group.description}</p>
                        )}
                      </div>
                      
                      {/* Selection Info */}
                      <div className="text-sm text-gray-400">
                        {group.type === 'SPECIAL_LOGIC' && group.name.includes('2 of 3') && (
                          <span>Select 2 of 3</span>
                        )}
                        {group.maxSelections && group.type !== 'SPECIAL_LOGIC' && (
                          <span>Max {group.maxSelections}</span>
                        )}
                      </div>
                    </div>

                    {/* Options */}
                    <div className="grid grid-cols-1 gap-3">
                      {group.options
                        .filter(option => option.isActive)
                        .sort((a, b) => a.sortOrder - b.sortOrder)
                        .map((option) => renderOption(group, option))
                      }
                    </div>

                    {/* Group-specific messaging */}
                    {group.type === 'SPECIAL_LOGIC' && group.name.includes('2 of 3') && (
                      <div className="bg-blue-900/30 border border-blue-600/50 rounded-lg p-3">
                        <div className="flex items-start space-x-2">
                          <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                          <div className="text-sm text-blue-200">
                            <strong>Dinner Plate Sides:</strong> Choose exactly 2 sides from the 3 options above. 
                            This is part of your complete dinner plate experience.
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              }
            </div>
          );
        } else {
          // Fallback to original single-column layout for other items
          return groups.map((group) => (
            <div key={group.id} className="space-y-4">
              {/* Group Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                    <span>{group.name}</span>
                    {group.isRequired && (
                      <span className="text-red-400 text-sm">*</span>
                    )}
                  </h3>
                  {group.description && (
                    <p className="text-sm text-gray-400 mt-1">{group.description}</p>
                  )}
                </div>
                
                {/* Selection Info */}
                <div className="text-sm text-gray-400">
                  {group.type === 'SPECIAL_LOGIC' && group.name.includes('2 of 3') && (
                    <span>Select 2 of 3</span>
                  )}
                  {group.maxSelections && group.type !== 'SPECIAL_LOGIC' && (
                    <span>Max {group.maxSelections}</span>
                  )}
                </div>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 gap-3">
                {group.options
                  .filter(option => option.isActive)
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .map((option) => renderOption(group, option))
                }
              </div>

              {/* Group-specific messaging */}
              {group.type === 'SPECIAL_LOGIC' && group.name.includes('2 of 3') && (
                <div className="bg-blue-900/30 border border-blue-600/50 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-200">
                      <strong>Dinner Plate Sides:</strong> Choose exactly 2 sides from the 3 options above. 
                      This is part of your complete dinner plate experience.
                    </div>
                  </div>
                </div>
              )}
            </div>
          ));
        }
      })()}

      {/* Validation Errors */}
      {errors.length > 0 && (
        <div className="bg-red-900/30 border border-red-600/50 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <X className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-red-300 mb-2">Please fix the following issues:</h4>
              <ul className="space-y-1">
                {errors.map((error, index) => (
                  <li key={index} className="text-sm text-red-200">
                    • {error}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
