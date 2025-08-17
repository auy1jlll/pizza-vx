'use client';

import { useState } from 'react';
import { Sandwich, Wheat, Droplets, Plus } from 'lucide-react';
import MenuItemCustomizer, { 
  CustomizationGroup, 
  CustomizationSelection 
} from './MenuItemCustomizer';

interface SandwichCustomizerProps {
  groups: CustomizationGroup[];
  selections: CustomizationSelection[];
  onSelectionsChange: (selections: CustomizationSelection[]) => void;
  basePrice: number;
  disabled?: boolean;
}

export default function SandwichCustomizer({
  groups,
  selections,
  onSelectionsChange,
  basePrice,
  disabled = false
}: SandwichCustomizerProps) {
  const [activeStep, setActiveStep] = useState(0);

  // Organize groups into steps for better UX
  const steps = [
    {
      id: 'size',
      title: 'Choose Size',
      icon: <Sandwich className="w-5 h-5" />,
      groups: groups.filter(g => g.name.toLowerCase().includes('size'))
    },
    {
      id: 'bread',
      title: 'Select Bread',
      icon: <Wheat className="w-5 h-5" />,
      groups: groups.filter(g => g.name.toLowerCase().includes('bread'))
    },
    {
      id: 'condiments',
      title: 'Add Condiments',
      icon: <Droplets className="w-5 h-5" />,
      groups: groups.filter(g => g.name.toLowerCase().includes('condiment'))
    },
    {
      id: 'toppings',
      title: 'Choose Toppings',
      icon: <Plus className="w-5 h-5" />,
      groups: groups.filter(g => g.name.toLowerCase().includes('topping'))
    }
  ].filter(step => step.groups.length > 0);

  const getStepStatus = (stepIndex: number) => {
    const step = steps[stepIndex];
    const hasRequiredSelections = step.groups.every(group => {
      if (!group.isRequired) return true;
      
      const groupOptionIds = group.options.map(opt => opt.id);
      const groupSelections = selections.filter(s => 
        groupOptionIds.includes(s.customizationOptionId)
      );
      
      return groupSelections.length >= group.minSelections;
    });

    if (stepIndex < activeStep) {
      return hasRequiredSelections ? 'completed' : 'error';
    } else if (stepIndex === activeStep) {
      return 'active';
    } else {
      return 'pending';
    }
  };

  const canProceedToStep = (stepIndex: number) => {
    for (let i = 0; i < stepIndex; i++) {
      if (getStepStatus(i) === 'error') {
        return false;
      }
    }
    return true;
  };

  return (
    <div className="space-y-6">
      {/* Step Navigation */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const canNavigate = canProceedToStep(index);
          
          return (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => canNavigate && setActiveStep(index)}
                disabled={!canNavigate || disabled}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200
                  ${status === 'completed' 
                    ? 'bg-green-600 text-white' 
                    : status === 'active'
                    ? 'bg-blue-600 text-white'
                    : status === 'error'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-600 text-gray-300'
                  }
                  ${canNavigate && !disabled ? 'hover:opacity-80 cursor-pointer' : 'cursor-not-allowed'}
                `}
              >
                {step.icon}
                <span className="text-sm font-medium">{step.title}</span>
                {status === 'completed' && (
                  <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-xs">✓</span>
                  </div>
                )}
              </button>
              
              {index < steps.length - 1 && (
                <div className={`
                  w-8 h-1 mx-2
                  ${getStepStatus(index) === 'completed' ? 'bg-green-600' : 'bg-gray-600'}
                `} />
              )}
            </div>
          );
        })}
      </div>

      {/* Current Step Content */}
      <div className="min-h-[400px]">
        {steps[activeStep] && (
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white flex items-center space-x-3">
                {steps[activeStep].icon}
                <span>{steps[activeStep].title}</span>
              </h3>
              <p className="text-gray-400 mt-2">
                {activeStep === 0 && "Start by choosing your sandwich size"}
                {activeStep === 1 && "Select your preferred bread type"}
                {activeStep === 2 && "Add your favorite condiments (optional)"}
                {activeStep === 3 && "Complete with delicious toppings (optional)"}
              </p>
            </div>

            <MenuItemCustomizer
              groups={steps[activeStep].groups}
              selections={selections}
              onSelectionsChange={onSelectionsChange}
              basePrice={basePrice}
              disabled={disabled}
            />
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t border-white/20">
        <button
          onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
          disabled={activeStep === 0 || disabled}
          className="px-6 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          Previous
        </button>

        <div className="text-sm text-gray-400">
          Step {activeStep + 1} of {steps.length}
        </div>

        <button
          onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
          disabled={activeStep === steps.length - 1 || getStepStatus(activeStep) === 'error' || disabled}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          Next
        </button>
      </div>

      {/* Sandwich Preview */}
      <div className="bg-black/30 rounded-lg p-4 border border-white/20">
        <h4 className="font-medium text-white mb-3 flex items-center">
          <Sandwich className="w-4 h-4 mr-2" />
          Your Sandwich
        </h4>
        <div className="space-y-2 text-sm">
          {steps.map((step, stepIndex) => {
            const stepSelections = step.groups.flatMap(group => {
              const groupOptionIds = group.options.map(opt => opt.id);
              return selections
                .filter(s => groupOptionIds.includes(s.customizationOptionId))
                .map(s => {
                  const option = group.options.find(opt => opt.id === s.customizationOptionId);
                  return option ? `${option.name}${s.quantity && s.quantity > 1 ? ` (x${s.quantity})` : ''}` : null;
                })
                .filter(Boolean);
            });

            if (stepSelections.length > 0) {
              return (
                <div key={step.id} className="flex justify-between">
                  <span className="text-gray-300">{step.title}:</span>
                  <span className="text-white">{stepSelections.join(', ')}</span>
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
}
