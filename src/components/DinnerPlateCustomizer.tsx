'use client';

import { useState, useEffect } from 'react';
import { Utensils, Check, Info, AlertCircle } from 'lucide-react';
import MenuItemCustomizer, { 
  CustomizationGroup, 
  CustomizationSelection 
} from './MenuItemCustomizer';

interface DinnerPlateCustomizerProps {
  groups: CustomizationGroup[];
  selections: CustomizationSelection[];
  onSelectionsChange: (selections: CustomizationSelection[]) => void;
  basePrice: number;
  disabled?: boolean;
  menuItemId: string;
}

export default function DinnerPlateCustomizer({
  groups,
  selections,
  onSelectionsChange,
  basePrice,
  disabled = false,
  menuItemId
}: DinnerPlateCustomizerProps) {
  const [sidesData, setSidesData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Find the sides group with special logic
  const sidesGroup = groups.find(g => g.type === 'SPECIAL_LOGIC');
  const otherGroups = groups.filter(g => g.type !== 'SPECIAL_LOGIC');

  useEffect(() => {
    if (sidesGroup) {
      updateSidesData();
    }
  }, [selections, sidesGroup]);

  const updateSidesData = async () => {
    if (!sidesGroup) return;

    try {
      setLoading(true);
      const selectedSideIds = selections
        .filter(s => sidesGroup.options.some(opt => opt.id === s.customizationOptionId))
        .map(s => s.customizationOptionId);

      const response = await fetch('/api/menu/dinner-plate-sides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mainItemId: menuItemId,
          selectedSideIds
        })
      });

      const result = await response.json();
      if (result.success) {
        setSidesData(result.data);
      }
    } catch (error) {
      console.error('Error updating sides data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSideSelection = (sideId: string) => {
    if (disabled) return;

    const isSelected = selections.some(s => s.customizationOptionId === sideId);
    const newSelections = [...selections];

    if (isSelected) {
      // Remove the side
      const index = newSelections.findIndex(s => s.customizationOptionId === sideId);
      if (index >= 0) {
        newSelections.splice(index, 1);
      }
    } else {
      // Add the side (if allowed)
      const currentSideSelections = newSelections.filter(s => 
        sidesGroup?.options.some(opt => opt.id === s.customizationOptionId)
      );

      if (currentSideSelections.length < 2) {
        newSelections.push({
          customizationOptionId: sideId,
          quantity: 1
        });
      }
    }

    onSelectionsChange(newSelections);
  };

  const getSideSelectionStatus = () => {
    if (!sidesGroup) return { count: 0, max: 0, isComplete: true };

    const sideSelections = selections.filter(s => 
      sidesGroup.options.some(opt => opt.id === s.customizationOptionId)
    );

    return {
      count: sideSelections.length,
      max: 2,
      isComplete: sideSelections.length === 2,
      tooMany: sideSelections.length > 2
    };
  };

  const status = getSideSelectionStatus();

  return (
    <div className="space-y-6">
      {/* Other customizations first */}
      {otherGroups.length > 0 && (
        <div>
          <MenuItemCustomizer
            groups={otherGroups}
            selections={selections}
            onSelectionsChange={onSelectionsChange}
            basePrice={basePrice}
            disabled={disabled}
          />
        </div>
      )}

      {/* Special Sides Selection */}
      {sidesGroup && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <Utensils className="w-5 h-5" />
              <span>{sidesGroup.name}</span>
              <span className="text-red-400 text-sm">*</span>
            </h3>
            
            <div className="text-right">
              <div className={`text-sm font-medium ${
                status.isComplete ? 'text-green-400' : 
                status.tooMany ? 'text-red-400' : 'text-yellow-400'
              }`}>
                {status.count} of {status.max} selected
              </div>
            </div>
          </div>

          {sidesGroup.description && (
            <p className="text-gray-400 text-sm">{sidesGroup.description}</p>
          )}

          {/* Special Instructions */}
          <div className="bg-blue-900/30 border border-blue-600/50 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-200">
                <strong>Complete Dinner Experience:</strong> Your dinner plate comes with your choice of 
                exactly 2 sides from our selection of 3 delicious options. This ensures the perfect 
                balance for your meal.
              </div>
            </div>
          </div>

          {/* Sides Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sidesGroup.options
              .filter(option => option.isActive)
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((side) => {
                const isSelected = selections.some(s => s.customizationOptionId === side.id);
                const canSelect = !isSelected && status.count < 2;
                const isDisabled = disabled || (!isSelected && !canSelect);

                return (
                  <div
                    key={side.id}
                    className={`
                      relative p-4 rounded-lg border transition-all duration-200 cursor-pointer
                      ${isSelected 
                        ? 'border-green-500 bg-green-50/10 shadow-lg' 
                        : 'border-gray-600 bg-black/20 hover:border-gray-500'
                      }
                      ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                    onClick={() => !isDisabled && handleSideSelection(side.id)}
                  >
                    {/* Selection Indicator */}
                    <div className="absolute top-3 right-3">
                      <div className={`
                        w-6 h-6 rounded-full border-2 flex items-center justify-center
                        ${isSelected ? 'border-green-500 bg-green-500' : 'border-gray-400'}
                      `}>
                        {isSelected && <Check className="w-4 h-4 text-white" />}
                      </div>
                    </div>

                    {/* Side Content */}
                    <div className="pr-8">
                      <h4 className="font-medium text-white mb-2">{side.name}</h4>
                      {side.description && (
                        <p className="text-sm text-gray-400 mb-3">{side.description}</p>
                      )}
                      
                      {/* Visual representation */}
                      <div className="text-3xl mb-2">
                        {side.name.includes('Fries') && '🍟'}
                        {side.name.includes('Rice') && '🍚'}
                        {side.name.includes('Vegetable') && '🥦'}
                        {!side.name.includes('Fries') && !side.name.includes('Rice') && !side.name.includes('Vegetable') && '🍽️'}
                      </div>

                      {side.priceModifier !== 0 && (
                        <div className={`text-sm font-medium ${
                          side.priceModifier > 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {side.priceModifier > 0 ? '+' : ''}${side.priceModifier.toFixed(2)}
                        </div>
                      )}
                    </div>

                    {/* Selection Status */}
                    {isSelected && (
                      <div className="absolute bottom-3 left-3">
                        <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">
                          Selected
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>

          {/* Selection Status */}
          <div className={`
            flex items-center space-x-2 p-3 rounded-lg border
            ${status.isComplete 
              ? 'border-green-600/50 bg-green-900/20' 
              : status.tooMany
              ? 'border-red-600/50 bg-red-900/20'
              : 'border-yellow-600/50 bg-yellow-900/20'
            }
          `}>
            {status.isComplete ? (
              <>
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-green-300 font-medium">
                  Perfect! You've selected 2 sides for your dinner plate.
                </span>
              </>
            ) : status.tooMany ? (
              <>
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-300 font-medium">
                  Please remove {status.count - 2} side{status.count - 2 > 1 ? 's' : ''} (only 2 allowed).
                </span>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-300 font-medium">
                  Please select {2 - status.count} more side{2 - status.count > 1 ? 's' : ''} to complete your dinner plate.
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
