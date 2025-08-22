'use client';

import { useState } from 'react';
import { Salad, Beef, Droplets, Plus } from 'lucide-react';
import MenuItemCustomizer, { 
  CustomizationGroup, 
  CustomizationSelection 
} from './MenuItemCustomizer';

interface SaladCustomizerProps {
  groups: CustomizationGroup[];
  selections: CustomizationSelection[];
  onSelectionsChange: (selections: CustomizationSelection[]) => void;
  basePrice: number;
  disabled?: boolean;
}

export default function SaladCustomizer({
  groups,
  selections,
  onSelectionsChange,
  basePrice,
  disabled = false
}: SaladCustomizerProps) {
  const [showProteinDetails, setShowProteinDetails] = useState(false);

  // Organize groups for salad-specific layout
  const sizeGroup = groups.find(g => g.name.toLowerCase().includes('size'));
  const proteinGroup = groups.find(g => g.name.toLowerCase().includes('protein'));
  const dressingGroup = groups.find(g => g.name.toLowerCase().includes('dressing'));
  const otherGroups = groups.filter(g => 
    !g.name.toLowerCase().includes('size') &&
    !g.name.toLowerCase().includes('protein') &&
    !g.name.toLowerCase().includes('dressing')
  );

  const getSelectedProtein = () => {
    if (!proteinGroup) return null;
    const proteinSelection = selections.find(s => 
      proteinGroup.options.some(opt => opt.id === s.customizationOptionId)
    );
    if (!proteinSelection) return null;
    return proteinGroup.options.find(opt => opt.id === proteinSelection.customizationOptionId);
  };

  const getSelectedDressing = () => {
    if (!dressingGroup) return null;
    const dressingSelection = selections.find(s => 
      dressingGroup.options.some(opt => opt.id === s.customizationOptionId)
    );
    if (!dressingSelection) return null;
    return dressingGroup.options.find(opt => opt.id === dressingSelection.customizationOptionId);
  };

  const calculateProteinPrice = (protein: any, quantity: number = 1) => {
    switch (protein.priceType) {
      case 'FLAT':
        return protein.priceModifier * quantity;
      case 'PERCENTAGE':
        return (basePrice * protein.priceModifier / 100) * quantity;
      case 'PER_UNIT':
        return protein.priceModifier * quantity;
      default:
        return 0;
    }
  };

  const selectedProtein = getSelectedProtein();
  const selectedDressing = getSelectedDressing();

  return (
    <div className="space-y-6">
      {/* Size Selection */}
      {sizeGroup && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
            <Salad className="w-5 h-5" />
            <span>Choose Your Size</span>
            <span className="text-red-400 text-sm">*</span>
          </h3>
          <MenuItemCustomizer
            groups={[sizeGroup]}
            selections={selections}
            onSelectionsChange={onSelectionsChange}
            basePrice={basePrice}
            disabled={disabled}
          />
        </div>
      )}

      {/* Protein Selection */}
      {proteinGroup && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <Beef className="w-5 h-5" />
              <span>Add Protein</span>
              <span className="text-gray-400 text-sm">(Optional)</span>
            </h3>
            <button
              onClick={() => setShowProteinDetails(!showProteinDetails)}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              {showProteinDetails ? 'Hide Details' : 'Show Details'}
            </button>
          </div>

          {/* Protein Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {proteinGroup.options
              .filter(option => option.isActive)
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((protein) => {
                const isSelected = selections.some(s => s.customizationOptionId === protein.id);
                const price = calculateProteinPrice(protein);

                return (
                  <div
                    key={protein.id}
                    className={`
                      relative p-4 rounded-lg border transition-all duration-200 cursor-pointer
                      ${isSelected 
                        ? 'border-green-500 bg-green-50/10 shadow-lg' 
                        : 'border-gray-600 bg-black/20 hover:border-gray-500'
                      }
                      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                    onClick={() => {
                      if (disabled) return;
                      const newSelections = selections.filter(s => 
                        !proteinGroup.options.some(opt => opt.id === s.customizationOptionId)
                      );
                      if (!isSelected) {
                        newSelections.push({
                          customizationOptionId: protein.id,
                          quantity: 1
                        });
                      }
                      onSelectionsChange(newSelections);
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className={`
                            w-5 h-5 rounded-full border-2 flex items-center justify-center
                            ${isSelected ? 'border-green-500 bg-green-500' : 'border-gray-400'}
                          `}>
                            {isSelected && <span className="text-white text-xs">✓</span>}
                          </div>
                          <div>
                            <h4 className="font-medium text-white">{protein.name}</h4>
                            {showProteinDetails && protein.description && (
                              <p className="text-sm text-gray-400 mt-1">{protein.description}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {price > 0 && (
                        <div className="text-green-400 font-semibold">
                          +${price.toFixed(2)}
                        </div>
                      )}
                    </div>

                    {/* Protein Icon */}
                    <div className="mt-3 text-2xl">
                      {protein.name.includes('Chicken') && '🐔'}
                      {protein.name.includes('Shrimp') && '🦐'}
                      {protein.name.includes('Salmon') && '🐟'}
                      {protein.name.includes('Turkey') && '🦃'}
                      {!protein.name.includes('Chicken') && 
                       !protein.name.includes('Shrimp') && 
                       !protein.name.includes('Salmon') && 
                       !protein.name.includes('Turkey') && '🥩'}
                    </div>
                  </div>
                );
              })}
          </div>

          {/* No Protein Option */}
          <div
            className={`
              p-4 rounded-lg border transition-all duration-200 cursor-pointer
              ${!selectedProtein 
                ? 'border-green-500 bg-green-50/10 shadow-lg' 
                : 'border-gray-600 bg-black/20 hover:border-gray-500'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            onClick={() => {
              if (disabled) return;
              const newSelections = selections.filter(s => 
                !proteinGroup.options.some(opt => opt.id === s.customizationOptionId)
              );
              onSelectionsChange(newSelections);
            }}
          >
            <div className="flex items-center space-x-3">
              <div className={`
                w-5 h-5 rounded-full border-2 flex items-center justify-center
                ${!selectedProtein ? 'border-green-500 bg-green-500' : 'border-gray-400'}
              `}>
                {!selectedProtein && <span className="text-white text-xs">✓</span>}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🥬</span>
                <span className="font-medium text-white">No Protein (Vegetarian)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dressing Selection */}
      {dressingGroup && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
            <Droplets className="w-5 h-5" />
            <span>Choose Your Dressing</span>
            <span className="text-red-400 text-sm">*</span>
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3" style={{ zIndex: 10, position: 'relative' }}>
            {dressingGroup.options
              .filter(option => option.isActive)
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((dressing) => {
                const isSelected = selections.some(s => s.customizationOptionId === dressing.id);
                const quantity = selections.find(s => s.customizationOptionId === dressing.id)?.quantity || 0;

                return (
                  <div
                    key={dressing.id}
                    className={`
                      relative p-3 rounded-lg border transition-all duration-200 cursor-pointer text-center
                      ${isSelected 
                        ? 'border-green-500 bg-green-50/10 shadow-lg' 
                        : 'border-gray-600 bg-black/20 hover:border-gray-500'
                      }
                      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                    style={{ zIndex: 15, position: 'relative' }}
                    onClick={() => {
                      if (disabled) return;
                      
                      const currentSelection = selections.find(s => s.customizationOptionId === dressing.id);
                      const isSelected = !!currentSelection;
                      const currentQuantity = currentSelection?.quantity || 0;
                      
                      // Count current group selections
                      const currentGroupSelections = selections.filter(s => 
                        dressingGroup.options.some(opt => opt.id === s.customizationOptionId)
                      );
                      
                      // Keep all other selections
                      const newSelections = selections.filter(s => s.customizationOptionId !== dressing.id);
                      
                      if (isSelected) {
                        // If already selected, try to increase quantity
                        const maxAllowed = dressing.maxQuantity || 2;
                        if (currentQuantity < maxAllowed) {
                          newSelections.push({
                            customizationOptionId: dressing.id,
                            quantity: currentQuantity + 1
                          });
                        }
                        // If max quantity reached, deselect (don't add back)
                      } else {
                        // Check if we can add a new selection (respect group max selections)
                        if (!dressingGroup.maxSelections || currentGroupSelections.length < dressingGroup.maxSelections) {
                          // First selection
                          newSelections.push({
                            customizationOptionId: dressing.id,
                            quantity: 1
                          });
                        }
                        // If max group selections reached, don't allow new selection
                      }
                      
                      onSelectionsChange(newSelections);
                    }}
                  >
                    <div className="mb-2 flex items-center justify-center space-x-2">
                      {isSelected && (
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                      {/* Quantity Badge */}
                      {isSelected && quantity > 1 && (
                        <div className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                          {quantity}x
                        </div>
                      )}
                    </div>
                    <div className="font-medium text-white text-sm">{dressing.name}</div>
                    {dressing.isDefault && (
                      <div className="text-xs text-blue-400 mt-1">Popular</div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Other Customizations */}
      {otherGroups.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Additional Options</span>
          </h3>
          <MenuItemCustomizer
            groups={otherGroups}
            selections={selections}
            onSelectionsChange={onSelectionsChange}
            basePrice={basePrice}
            disabled={disabled}
          />
        </div>
      )}
    </div>
  );
}
