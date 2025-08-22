'use client';

import { useState } from 'react';
import { Fish, Flame, ChefHat, Thermometer } from 'lucide-react';
import MenuItemCustomizer, { 
  CustomizationGroup, 
  CustomizationSelection 
} from './MenuItemCustomizer';

interface SeafoodCustomizerProps {
  groups: CustomizationGroup[];
  selections: CustomizationSelection[];
  onSelectionsChange: (selections: CustomizationSelection[]) => void;
  basePrice: number;
  disabled?: boolean;
}

export default function SeafoodCustomizer({
  groups,
  selections,
  onSelectionsChange,
  basePrice,
  disabled = false
}: SeafoodCustomizerProps) {
  const [showPreparationDetails, setShowPreparationDetails] = useState(false);

  // Organize groups for seafood-specific layout
  const preparationGroup = groups.find(g => 
    g.name.toLowerCase().includes('preparation') || 
    g.name.toLowerCase().includes('cooking')
  );
  const seasoningGroup = groups.find(g => 
    g.name.toLowerCase().includes('seasoning') || 
    g.name.toLowerCase().includes('spice')
  );
  const sidesGroup = groups.find(g => g.name.toLowerCase().includes('side'));
  const sauceGroup = groups.find(g => g.name.toLowerCase().includes('sauce'));
  const otherGroups = groups.filter(g => 
    !g.name.toLowerCase().includes('preparation') &&
    !g.name.toLowerCase().includes('cooking') &&
    !g.name.toLowerCase().includes('seasoning') &&
    !g.name.toLowerCase().includes('spice') &&
    !g.name.toLowerCase().includes('side') &&
    !g.name.toLowerCase().includes('sauce')
  );

  const getSelectedPreparation = () => {
    if (!preparationGroup) return null;
    const selection = selections.find(s => 
      preparationGroup.options.some(opt => opt.id === s.customizationOptionId)
    );
    if (!selection) return null;
    return preparationGroup.options.find(opt => opt.id === selection.customizationOptionId);
  };

  const getSelectedSeasoning = () => {
    if (!seasoningGroup) return null;
    const selection = selections.find(s => 
      seasoningGroup.options.some(opt => opt.id === s.customizationOptionId)
    );
    if (!selection) return null;
    return seasoningGroup.options.find(opt => opt.id === selection.customizationOptionId);
  };

  const getPreparationIcon = (prepName: string) => {
    if (prepName.toLowerCase().includes('grilled')) return '🔥';
    if (prepName.toLowerCase().includes('fried')) return '🍤';
    if (prepName.toLowerCase().includes('baked')) return '🔥';
    if (prepName.toLowerCase().includes('blackened')) return '🌶️';
    if (prepName.toLowerCase().includes('steamed')) return '💨';
    if (prepName.toLowerCase().includes('raw')) return '🥢';
    return '🐟';
  };

  const selectedPreparation = getSelectedPreparation();
  const selectedSeasoning = getSelectedSeasoning();

  return (
    <div className="space-y-6">
      {/* Seafood Visual Header */}
      <div className="bg-gradient-to-r from-blue-900/40 to-teal-900/40 rounded-lg p-6 border border-blue-600/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-4xl">🦞</div>
            <div>
              <h3 className="text-xl font-bold text-white">Fresh Seafood Selection</h3>
              <p className="text-blue-200">Prepared to perfection, just for you</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-400">
              ${basePrice.toFixed(2)}
            </div>
            <div className="text-sm text-blue-300">Starting price</div>
          </div>
        </div>
      </div>

      {/* Preparation Method */}
      {preparationGroup && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <ChefHat className="w-5 h-5" />
              <span>Choose Preparation Method</span>
              <span className="text-red-400 text-sm">*</span>
            </h3>
            <button
              onClick={() => setShowPreparationDetails(!showPreparationDetails)}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              {showPreparationDetails ? 'Hide Details' : 'Show Details'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {preparationGroup.options
              .filter(option => option.isActive)
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((preparation) => {
                const isSelected = selections.some(s => s.customizationOptionId === preparation.id);
                const hasPrice = preparation.priceModifier > 0;

                return (
                  <div
                    key={preparation.id}
                    className={`
                      relative p-4 rounded-lg border transition-all duration-200 cursor-pointer
                      ${isSelected 
                        ? 'border-blue-500 bg-blue-50/10 shadow-lg' 
                        : 'border-gray-600 bg-black/20 hover:border-gray-500'
                      }
                      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                    onClick={() => {
                      if (disabled) return;
                      const newSelections = selections.filter(s => 
                        !preparationGroup.options.some(opt => opt.id === s.customizationOptionId)
                      );
                      newSelections.push({
                        customizationOptionId: preparation.id,
                        quantity: 1
                      });
                      onSelectionsChange(newSelections);
                    }}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">
                        {getPreparationIcon(preparation.name)}
                      </div>
                      
                      <div className={`
                        w-5 h-5 mx-auto mb-3 rounded-full border-2 flex items-center justify-center
                        ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-400'}
                      `}>
                        {isSelected && <span className="text-white text-xs">✓</span>}
                      </div>

                      <h4 className="font-medium text-white mb-1">{preparation.name}</h4>
                      
                      {showPreparationDetails && preparation.description && (
                        <p className="text-xs text-gray-400 mb-2">{preparation.description}</p>
                      )}

                      {hasPrice && (
                        <div className="text-blue-400 font-semibold text-sm">
                          +${preparation.priceModifier.toFixed(2)}
                        </div>
                      )}

                      {preparation.isDefault && (
                        <div className="absolute top-2 right-2">
                          <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded-full">
                            Popular
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Seasoning Selection */}
      {seasoningGroup && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
            <Flame className="w-5 h-5" />
            <span>Select Seasoning</span>
            <span className="text-red-400 text-sm">*</span>
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {seasoningGroup.options
              .filter(option => option.isActive)
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((seasoning) => {
                const isSelected = selections.some(s => s.customizationOptionId === seasoning.id);
                const spiceLevel = seasoning.name.toLowerCase().includes('spicy') ? 3 :
                                 seasoning.name.toLowerCase().includes('mild') ? 1 :
                                 seasoning.name.toLowerCase().includes('medium') ? 2 : 0;

                return (
                  <div
                    key={seasoning.id}
                    className={`
                      p-3 rounded-lg border transition-all duration-200 cursor-pointer
                      ${isSelected 
                        ? 'border-blue-500 bg-blue-50/10 shadow-lg' 
                        : 'border-gray-600 bg-black/20 hover:border-gray-500'
                      }
                      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                    onClick={() => {
                      if (disabled) return;
                      const newSelections = selections.filter(s => 
                        !seasoningGroup.options.some(opt => opt.id === s.customizationOptionId)
                      );
                      newSelections.push({
                        customizationOptionId: seasoning.id,
                        quantity: 1
                      });
                      onSelectionsChange(newSelections);
                    }}
                  >
                    <div className="text-center">
                      <div className={`
                        w-5 h-5 mx-auto mb-2 rounded-full border-2 flex items-center justify-center
                        ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-400'}
                      `}>
                        {isSelected && <span className="text-white text-xs">✓</span>}
                      </div>

                      <div className="font-medium text-white text-sm mb-1">{seasoning.name}</div>
                      
                      {/* Spice Level Indicator */}
                      {spiceLevel > 0 && (
                        <div className="flex justify-center space-x-1 mb-1">
                          {[...Array(3)].map((_, i) => (
                            <Thermometer
                              key={i}
                              className={`w-3 h-3 ${
                                i < spiceLevel ? 'text-red-500' : 'text-gray-500'
                              }`}
                            />
                          ))}
                        </div>
                      )}

                      {seasoning.isDefault && (
                        <div className="text-xs text-yellow-400">Chef's Choice</div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Sides Selection */}
      {sidesGroup && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
            <Fish className="w-5 h-5" />
            <span>Choose Your Sides</span>
            <span className="text-gray-400 text-sm">(Optional)</span>
          </h3>
          <MenuItemCustomizer
            groups={[sidesGroup]}
            selections={selections}
            onSelectionsChange={onSelectionsChange}
            basePrice={basePrice}
            disabled={disabled}
          />
        </div>
      )}

      {/* Sauce Selection */}
      {sauceGroup && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Sauce Selection</h3>
          <MenuItemCustomizer
            groups={[sauceGroup]}
            selections={selections}
            onSelectionsChange={onSelectionsChange}
            basePrice={basePrice}
            disabled={disabled}
          />
        </div>
      )}

      {/* Other Customizations */}
      {otherGroups.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Additional Options</h3>
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
