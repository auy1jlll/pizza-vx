'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/components/ToastProvider';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';

interface PizzaSize {
  id: string;
  name: string;
  diameter: string;
  basePrice: number;
  isActive: boolean;
  sortOrder: number;
}

interface PizzaCrust {
  id: string;
  name: string;
  description: string;
  priceModifier: number;
  isActive: boolean;
  sortOrder: number;
}

interface PizzaSauce {
  id: string;
  name: string;
  description: string;
  color: string;
  spiceLevel: number;
  priceModifier: number;
  isActive: boolean;
  sortOrder: number;
}

interface PizzaTopping {
  id: string;
  name: string;
  category: string;
  price: number;
  isActive: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  sortOrder: number;
}

interface SelectedTopping {
  toppingId: string;
  section: 'WHOLE' | 'LEFT' | 'RIGHT';
  quantity?: number;
  intensity: 'LIGHT' | 'REGULAR' | 'EXTRA';
}

interface CartItem {
  sizeId: string;
  sizeName: string;
  crustId: string;
  crustName: string;
  sauceId: string;
  sauceName: string;
  sauceIntensity: 'LIGHT' | 'REGULAR' | 'EXTRA';
  crustCookingLevel: 'LIGHT' | 'REGULAR' | 'WELL_DONE';
  toppings: Array<{
    toppingId: string;
    toppingName: string;
    section: 'WHOLE' | 'LEFT' | 'RIGHT';
    intensity: 'LIGHT' | 'REGULAR' | 'EXTRA';
    price: number;
  }>;
  notes?: string;
  totalPrice: number;
  specialtyPizzaName?: string; // Add this to track if it's based on a specialty pizza
  specialtyPizzaChanges?: {
    addedToppings: Array<{
      toppingId: string;
      toppingName: string;
      section: 'WHOLE' | 'LEFT' | 'RIGHT';
      intensity: 'LIGHT' | 'REGULAR' | 'EXTRA';
    }>;
    removedToppings: Array<{
      toppingId: string;
      toppingName: string;
      section: 'WHOLE' | 'LEFT' | 'RIGHT';
      intensity: 'LIGHT' | 'REGULAR' | 'EXTRA';
    }>;
    modifiedToppings: Array<{
      toppingId: string;
      toppingName: string;
      section: 'WHOLE' | 'LEFT' | 'RIGHT';
      originalIntensity: 'LIGHT' | 'REGULAR' | 'EXTRA';
      newIntensity: 'LIGHT' | 'REGULAR' | 'EXTRA';
    }>;
  };
}

interface PizzaBuilderData {
  sizes: PizzaSize[];
  crusts: PizzaCrust[];
  sauces: PizzaSauce[];
  toppings: PizzaTopping[];
}

interface SpecialtyPizza {
  id: string;
  name: string;
  description: string;
  category: string;
  basePrice: number;
  defaultSizeId: string;
  defaultCrustId: string;
  defaultSauceId: string;
  sauceIntensity: 'LIGHT' | 'REGULAR' | 'EXTRA';
  crustCookingLevel: 'LIGHT' | 'REGULAR' | 'WELL_DONE';
  imageUrl?: string;
  toppings: Array<{
    toppingId: string;
    section: 'WHOLE' | 'LEFT' | 'RIGHT';
    intensity: 'LIGHT' | 'REGULAR' | 'EXTRA';
  }>;
  availableSizes?: Array<{
    id: string;
    name: string;
    diameter: string;
    price: number;
  }>;
}

interface Selection {
  size: PizzaSize | null;
  crust: PizzaCrust | null;
  crustCookingLevel: 'LIGHT' | 'REGULAR' | 'WELL_DONE';
  sauce: PizzaSauce | null;
  sauceIntensity: 'LIGHT' | 'REGULAR' | 'EXTRA';
  toppings: SelectedTopping[];
}

// Helper function to generate pizza description
function generatePizzaDescription(selection: Selection, detailedToppings: any[], specialtyPizza?: SpecialtyPizza | null): string {
  if (specialtyPizza) {
    const modifications = [];
    if (selection.size) modifications.push(`${selection.size.name} size`);
    if (selection.crust && selection.crust.name !== 'Classic Hand Tossed') modifications.push(selection.crust.name.toLowerCase());
    if (selection.sauce && selection.sauce.name !== 'Traditional Marinara') modifications.push(selection.sauce.name.toLowerCase());
    
    if (modifications.length > 0) {
      return `${specialtyPizza.name} pizza (${modifications.join(', ')})`;
    }
    return `${specialtyPizza.name} pizza`;
  }

  const parts = [];
  if (selection.size) parts.push(selection.size.name);
  if (selection.crust) parts.push(selection.crust.name.toLowerCase());
  
  const toppings = detailedToppings.filter(t => t.isActive);
  if (toppings.length === 0) {
    parts.push('cheese pizza');
  } else if (toppings.length <= 3) {
    const toppingNames = toppings.map(t => t.name.toLowerCase());
    parts.push(`${toppingNames.join(' & ')} pizza`);
  } else {
    parts.push(`pizza with ${toppings.length} toppings`);
  }

  return parts.join(' ');
}

// Helper function to show success message
function showPizzaAddedMessage(pizzaDescription: string, totalPrice: number): void {
  // Create a toast-style notification
  const message = `🍕 ${pizzaDescription.charAt(0).toUpperCase() + pizzaDescription.slice(1)} added to cart! ($${totalPrice.toFixed(2)})`;
  
  // Create toast element
  const toast = document.createElement('div');
  toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in';
  toast.style.cssText = `
    position: fixed;
    top: 1rem;
    right: 1rem;
    background-color: #10b981;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    z-index: 9999;
    font-weight: 600;
    animation: slideInRight 0.3s ease-out;
    max-width: 400px;
  `;
  
  // Add animation styles to document head if not already present
  if (!document.querySelector('#toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOutRight {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  toast.textContent = message;
  document.body.appendChild(toast);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    toast.style.animation = 'slideOutRight 0.3s ease-in';
    setTimeout(() => {
      if (toast.parentNode) {
        document.body.removeChild(toast);
      }
    }, 300);
  }, 3000);
}

export default function PizzaBuilder() {
  const searchParams = useSearchParams();
  const specialtyId = searchParams.get('specialty');
  const selectedSizeId = searchParams.get('size'); // Get the selected size from URL
  const { cartItems, addPizza, addDetailedPizza, calculateSubtotal } = useCart();
  const { show: showToast } = useToast();
  
  const [data, setData] = useState<PizzaBuilderData | null>(null);
  const [specialtyPizza, setSpecialtyPizza] = useState<SpecialtyPizza | null>(null);
  const [originalSpecialtyToppings, setOriginalSpecialtyToppings] = useState<SelectedTopping[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('SIZE');
  const [activeSection, setActiveSection] = useState<'WHOLE' | 'LEFT' | 'RIGHT'>('WHOLE');
  const [activeToppingCategory, setActiveToppingCategory] = useState('CHEESE');
  const [notes, setNotes] = useState('');
  const [selection, setSelection] = useState<Selection>({
    size: null,
    crust: null,
    crustCookingLevel: 'REGULAR',
    sauce: null,
    sauceIntensity: 'REGULAR',
    toppings: []
  });

  // Debug selection changes
  useEffect(() => {
    console.log('[PizzaBuilder] Selection changed:', {
      size: selection.size?.name,
      crust: selection.crust?.name,
      sauce: selection.sauce?.name,
      toppingsCount: selection.toppings.length
    });
  }, [selection]);

  const tabs = [
    { id: 'SIZE', label: 'SIZE' },
    { id: 'SAUCE', label: 'SAUCE' },
    { id: 'CRUST', label: 'CRUST' },
    { id: 'TOPPINGS', label: 'TOPPINGS' },
    { id: 'REVIEW', label: 'REVIEW' }
  ];

  useEffect(() => {
    console.log('[PizzaBuilder] Component mounting with specialtyId:', specialtyId, 'selectedSizeId:', selectedSizeId);
    console.log('[PizzaBuilder] About to fetch pizza data...');
    fetchPizzaData();
    
    // Load specialty pizza if specified
    if (specialtyId) {
      console.log('[PizzaBuilder] SpecialtyId found, fetching specialty pizza...');
      fetchSpecialtyPizza(specialtyId);
    } else {
      console.log('[PizzaBuilder] No specialtyId, this is fresh pizza building');
    }
  }, [specialtyId]);

  const fetchPizzaData = async () => {
    console.log('[PizzaBuilder] fetchPizzaData started');
    try {
      // Force fresh data - no caching during debugging
      const response = await fetch(`/api/pizza-data?t=${Date.now()}`, {
        // Force no cache
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      console.log('[PizzaBuilder] Pizza data response status:', response.status);
      const data = await response.json();
      console.log('[PizzaBuilder] Pizza data received:', {
        sizes: data.sizes?.length,
        crusts: data.crusts?.length,
        sauces: data.sauces?.length,
        toppings: data.toppings?.length
      });
      
      if (data.sizes && data.crusts && data.sauces && data.toppings) {
        console.log('[PizzaBuilder] Setting pizza data...');
        setData(data);
        
        // Set default active topping category to first available
        const categories = [...new Set(data.toppings.map((t: PizzaTopping) => t.category))];
        if (categories.length > 0) {
          setActiveToppingCategory(categories[0] as string);
        }
        
        // Set default selections ONLY for fresh pizza building
        if (!specialtyId) {
          console.log('[PizzaBuilder] Fresh pizza - setting defaults');
          // Fresh pizza building - use proper defaults
          const defaultSize = data.sizes.find((s: PizzaSize) => s.sortOrder === 2) || data.sizes[1] || data.sizes[0];
          const defaultCrust = data.crusts.find((c: PizzaCrust) => c.sortOrder === 1) || data.crusts[0];
          const defaultSauce = data.sauces.find((s: PizzaSauce) => s.sortOrder === 1) || data.sauces[0];
          const cheeseTopping = data.toppings.find((t: PizzaTopping) => 
            t.category === 'CHEESE' && t.sortOrder === 1
          ) || data.toppings.find((t: PizzaTopping) => t.category === 'CHEESE');

          setSelection({
            size: defaultSize,
            crust: defaultCrust,
            crustCookingLevel: 'REGULAR',
            sauce: defaultSauce,
            sauceIntensity: 'REGULAR',
            toppings: []
          });
        } else {
          console.log('[PizzaBuilder] Specialty pizza - NOT setting defaults, waiting for specialty data');
        }
        // For specialty pizzas, DON'T set any defaults here - wait for specialty data to load
      } else {
        console.error('[PizzaBuilder] Invalid pizza data structure:', data);
      }
    } catch (error) {
      console.error('[PizzaBuilder] Error fetching pizza data:', error);
    } finally {
      console.log('[PizzaBuilder] fetchPizzaData finished, setting loading to false');
      setLoading(false);
    }
  };

  const fetchSpecialtyPizza = async (specialtyId: string) => {
    console.log('[PizzaBuilder] fetchSpecialtyPizza started for:', specialtyId);
    try {
      const response = await fetch(`/api/specialty-pizzas/${specialtyId}`);
      console.log('[PizzaBuilder] Specialty pizza response status:', response.status);
      if (response.ok) {
        const specialty = await response.json();
        console.log('[PizzaBuilder] Specialty pizza data received:', specialty.name);
        setSpecialtyPizza(specialty);
        // Note: Don't load selection here - let the useEffect handle it when both data and specialty are ready
      } else {
        console.error('[PizzaBuilder] Failed to fetch specialty pizza:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('[PizzaBuilder] Error fetching specialty pizza:', error);
    }
  };

  const loadSpecialtyPizzaSelection = (specialty: SpecialtyPizza) => {
    console.log('[PizzaBuilder] loadSpecialtyPizzaSelection called with:', specialty.name);
    if (!data) {
      console.log('[PizzaBuilder] No data available, returning');
      return;
    }
    
    console.log('[PizzaBuilder] Data available, loading specialty selection...');
    console.log('[PizzaBuilder] Specialty object:', specialty);
    
    // Find the specialty pizza components in the data
    // Use the selected size from URL if available, otherwise use default
    const specialtySize = selectedSizeId 
      ? data.sizes.find(s => s.id === selectedSizeId) || data.sizes[0]
      : data.sizes.find(s => s.id === specialty.defaultSizeId) || data.sizes[0];
    const specialtyCrust = data.crusts.find(c => c.id === specialty.defaultCrustId) || data.crusts[0];
    const specialtySauce = data.sauces.find(s => s.id === specialty.defaultSauceId) || data.sauces[0];
    
    console.log('[PizzaBuilder] Selected specialty size:', specialtySize?.name);
    console.log('[PizzaBuilder] Selected specialty crust:', specialtyCrust?.name);
    console.log('[PizzaBuilder] Selected specialty sauce:', specialtySauce?.name);
    
    // Check if specialty has 'toppings' or 'ingredients' property
    const toppingsSource = specialty.toppings || (specialty as any).ingredients || [];
    console.log('[PizzaBuilder] Toppings source:', toppingsSource);
    
    // Convert specialty toppings to selection format
    const specialtyToppings: SelectedTopping[] = toppingsSource.map((t: any) => ({
      toppingId: t.toppingId,
      section: t.section || 'WHOLE',
      quantity: 1,
      intensity: t.intensity || 'REGULAR'
    }));
    
    console.log('[PizzaBuilder] Specialty toppings:', specialtyToppings.length, 'items');
    
    // Store the original specialty toppings for comparison
    setOriginalSpecialtyToppings([...specialtyToppings]);
    
    const newSelection = {
      size: specialtySize,
      crust: specialtyCrust,
      crustCookingLevel: specialty.crustCookingLevel || 'REGULAR',
      sauce: specialtySauce,
      sauceIntensity: specialty.sauceIntensity || 'REGULAR',
      toppings: specialtyToppings
    };
    
    console.log('[PizzaBuilder] Setting new selection:', newSelection);
    
    // Update selection with specialty pizza data
    setSelection(newSelection);
    
    // Set active tab to SIZE so user sees the loaded data
    setActiveTab('SIZE');
  };

  // Load specialty selection when both data and specialty are available
  useEffect(() => {
    console.log('[PizzaBuilder] useEffect triggered - data:', !!data, 'specialtyPizza:', !!specialtyPizza);
    if (data && specialtyPizza) {
      console.log('[PizzaBuilder] Both data and specialty available, loading selection...');
      loadSpecialtyPizzaSelection(specialtyPizza);
    }
  }, [data, specialtyPizza]);

  // Calculate specialty pizza changes
  const getSpecialtyPizzaChanges = () => {
    const addedToppings: Array<{
      toppingId: string;
      toppingName: string;
      section: 'WHOLE' | 'LEFT' | 'RIGHT';
      intensity: 'LIGHT' | 'REGULAR' | 'EXTRA';
    }> = [];
    
    const removedToppings: Array<{
      toppingId: string;
      toppingName: string;
      section: 'WHOLE' | 'LEFT' | 'RIGHT';
      intensity: 'LIGHT' | 'REGULAR' | 'EXTRA';
    }> = [];
    
    const modifiedToppings: Array<{
      toppingId: string;
      toppingName: string;
      section: 'WHOLE' | 'LEFT' | 'RIGHT';
      originalIntensity: 'LIGHT' | 'REGULAR' | 'EXTRA';
      newIntensity: 'LIGHT' | 'REGULAR' | 'EXTRA';
    }> = [];

    if (!specialtyPizza || originalSpecialtyToppings.length === 0) {
      return { addedToppings, removedToppings, modifiedToppings };
    }

    // Find removed toppings
    originalSpecialtyToppings.forEach(originalTopping => {
      const currentTopping = selection.toppings.find(t => 
        t.toppingId === originalTopping.toppingId && t.section === originalTopping.section
      );
      
      if (!currentTopping) {
        const toppingData = data?.toppings.find(t => t.id === originalTopping.toppingId);
        if (toppingData) {
          removedToppings.push({
            toppingId: originalTopping.toppingId,
            toppingName: toppingData.name,
            section: originalTopping.section,
            intensity: originalTopping.intensity
          });
        }
      } else if (currentTopping.intensity !== originalTopping.intensity) {
        // Find modified toppings (intensity changed)
        const toppingData = data?.toppings.find(t => t.id === originalTopping.toppingId);
        if (toppingData) {
          modifiedToppings.push({
            toppingId: originalTopping.toppingId,
            toppingName: toppingData.name,
            section: originalTopping.section,
            originalIntensity: originalTopping.intensity,
            newIntensity: currentTopping.intensity
          });
        }
      }
    });

    // Find added toppings
    selection.toppings.forEach(currentTopping => {
      const originalTopping = originalSpecialtyToppings.find(t => 
        t.toppingId === currentTopping.toppingId && t.section === currentTopping.section
      );
      
      if (!originalTopping) {
        const toppingData = data?.toppings.find(t => t.id === currentTopping.toppingId);
        if (toppingData) {
          addedToppings.push({
            toppingId: currentTopping.toppingId,
            toppingName: toppingData.name,
            section: currentTopping.section,
            intensity: currentTopping.intensity
          });
        }
      }
    });

    return {
      addedToppings,
      removedToppings,
      modifiedToppings
    };
  };

  const toggleTopping = (topping: PizzaTopping, section: 'WHOLE' | 'LEFT' | 'RIGHT') => {
    const existingToppingIndex = selection.toppings.findIndex(
      t => t.toppingId === topping.id && t.section === section
    );

    if (existingToppingIndex >= 0) {
      // Remove topping from this section
      setSelection(prev => ({
        ...prev,
        toppings: prev.toppings.filter((_, index) => index !== existingToppingIndex)
      }));
    } else {
      // First remove this topping from any other sections (make it mutually exclusive)
      const filteredToppings = selection.toppings.filter(t => t.toppingId !== topping.id);
      
      // Then add topping to the new section
      setSelection(prev => ({
        ...prev,
        toppings: [...filteredToppings, {
          toppingId: topping.id,
          section: section,
          quantity: 1,
          intensity: 'REGULAR'
        }]
      }));
    }
  };

  const updateSauceIntensity = (intensity: 'LIGHT' | 'REGULAR' | 'EXTRA') => {
    setSelection(prev => ({ ...prev, sauceIntensity: intensity }));
  };

  const updateCrustCookingLevel = (level: 'LIGHT' | 'REGULAR' | 'WELL_DONE') => {
    setSelection(prev => ({ ...prev, crustCookingLevel: level }));
  };

  const updateToppingIntensity = (toppingId: string, section: 'WHOLE' | 'LEFT' | 'RIGHT', intensity: 'LIGHT' | 'REGULAR' | 'EXTRA') => {
    setSelection(prev => ({
      ...prev,
      toppings: prev.toppings.map(t => 
        t.toppingId === toppingId && t.section === section 
          ? { ...t, intensity }
          : t
      )
    }));
  };

  const calculateTotal = () => {
    if (!selection.size || !data) return 0;
    
    // Use specialty pizza size-specific price if available, otherwise use size base price
    let total: number;
    if (specialtyPizza) {
      // Find the size-specific price for this specialty pizza
      const sizeOption = specialtyPizza.availableSizes?.find(s => s.id === selection.size!.id);
      total = sizeOption ? sizeOption.price : specialtyPizza.basePrice;
    } else {
      total = selection.size.basePrice;
    }
    
    // Only add modifiers if not using specialty base price
    if (!specialtyPizza) {
      if (selection.crust) total += selection.crust.priceModifier;
      if (selection.sauce) total += selection.sauce.priceModifier;
    }
    
    // Calculate topping modifications from the original specialty configuration
    if (specialtyPizza && originalSpecialtyToppings.length > 0) {
      // For specialty pizzas, calculate the difference from the original configuration
      const changes = getSpecialtyPizzaChanges();
      
      // Add price for new toppings not in the original
      changes.addedToppings.forEach(addedTopping => {
        const topping = data?.toppings.find(t => t.id === addedTopping.toppingId);
        if (topping) {
          const intensityMultiplier = addedTopping.intensity === 'LIGHT' ? 0.75 : 
                                    addedTopping.intensity === 'EXTRA' ? 1.5 : 1;
          total += topping.price * intensityMultiplier;
        }
      });
      
      // Subtract price for removed original toppings (provide credit)
      changes.removedToppings.forEach(removedTopping => {
        const topping = data?.toppings.find(t => t.id === removedTopping.toppingId);
        if (topping) {
          const intensityMultiplier = removedTopping.intensity === 'LIGHT' ? 0.75 : 
                                    removedTopping.intensity === 'EXTRA' ? 1.5 : 1;
          total -= topping.price * intensityMultiplier * 0.5; // 50% credit for removals
        }
      });
      
      // Apply pricing adjustments for intensity modifications
      changes.modifiedToppings.forEach(modifiedTopping => {
        const topping = data?.toppings.find(t => t.id === modifiedTopping.toppingId);
        if (topping) {
          const originalMultiplier = modifiedTopping.originalIntensity === 'LIGHT' ? 0.75 : 
                                   modifiedTopping.originalIntensity === 'EXTRA' ? 1.5 : 1;
          const newMultiplier = modifiedTopping.newIntensity === 'LIGHT' ? 0.75 : 
                              modifiedTopping.newIntensity === 'EXTRA' ? 1.5 : 1;
          
          // Apply the difference in pricing
          const priceDifference = topping.price * (newMultiplier - originalMultiplier);
          total += priceDifference;
        }
      });
    } else {
      // Regular pizza - add all topping prices with intensity modifiers
      selection.toppings.forEach(selectedTopping => {
        const topping = data?.toppings.find(t => t.id === selectedTopping.toppingId);
        if (topping) {
          const intensityMultiplier = selectedTopping.intensity === 'LIGHT' ? 0.75 : 
                                    selectedTopping.intensity === 'EXTRA' ? 1.5 : 1;
          total += topping.price * intensityMultiplier * (selectedTopping.quantity || 1);
        }
      });
    }
    
    return Math.max(total, 0); // Ensure total never goes negative
  };

  // Calculate detailed pricing breakdown for specialty pizzas
  const getPricingBreakdown = () => {
    if (!selection.size || !data) return null;
    
    // Calculate correct base price for specialty pizzas based on selected size
    let basePrice: number;
    if (specialtyPizza) {
      const sizeOption = specialtyPizza.availableSizes?.find(s => s.id === selection.size!.id);
      basePrice = sizeOption ? sizeOption.price : specialtyPizza.basePrice;
    } else {
      basePrice = selection.size.basePrice;
    }
    
    const breakdown = {
      basePrice,
      baseName: specialtyPizza ? specialtyPizza.name : `${selection.size.name} Pizza`,
      crustModifier: !specialtyPizza && selection.crust ? selection.crust.priceModifier : 0,
      sauceModifier: !specialtyPizza && selection.sauce ? selection.sauce.priceModifier : 0,
      addedToppingsPrice: 0,
      removedToppingsCredit: 0,
      intensityAdjustments: 0,
      total: 0
    };
    
    if (specialtyPizza && originalSpecialtyToppings.length > 0) {
      const changes = getSpecialtyPizzaChanges();
      
      // Calculate added toppings price
      changes.addedToppings.forEach(addedTopping => {
        const topping = data?.toppings.find(t => t.id === addedTopping.toppingId);
        if (topping) {
          const intensityMultiplier = addedTopping.intensity === 'LIGHT' ? 0.75 : 
                                    addedTopping.intensity === 'EXTRA' ? 1.5 : 1;
          breakdown.addedToppingsPrice += topping.price * intensityMultiplier;
        }
      });
      
      // Calculate removed toppings credit
      changes.removedToppings.forEach(removedTopping => {
        const topping = data?.toppings.find(t => t.id === removedTopping.toppingId);
        if (topping) {
          const intensityMultiplier = removedTopping.intensity === 'LIGHT' ? 0.75 : 
                                    removedTopping.intensity === 'EXTRA' ? 1.5 : 1;
          breakdown.removedToppingsCredit += topping.price * intensityMultiplier * 0.5; // 50% credit
        }
      });
      
      // Calculate intensity adjustments
      changes.modifiedToppings.forEach(modifiedTopping => {
        const topping = data?.toppings.find(t => t.id === modifiedTopping.toppingId);
        if (topping) {
          const originalMultiplier = modifiedTopping.originalIntensity === 'LIGHT' ? 0.75 : 
                                   modifiedTopping.originalIntensity === 'EXTRA' ? 1.5 : 1;
          const newMultiplier = modifiedTopping.newIntensity === 'LIGHT' ? 0.75 : 
                              modifiedTopping.newIntensity === 'EXTRA' ? 1.5 : 1;
          
          breakdown.intensityAdjustments += topping.price * (newMultiplier - originalMultiplier);
        }
      });
    } else {
      // Regular pizza toppings
      selection.toppings.forEach(selectedTopping => {
        const topping = data?.toppings.find(t => t.id === selectedTopping.toppingId);
        if (topping) {
          const intensityMultiplier = selectedTopping.intensity === 'LIGHT' ? 0.75 : 
                                    selectedTopping.intensity === 'EXTRA' ? 1.5 : 1;
          breakdown.addedToppingsPrice += topping.price * intensityMultiplier * (selectedTopping.quantity || 1);
        }
      });
    }
    
    breakdown.total = Math.max(
      breakdown.basePrice + 
      breakdown.crustModifier + 
      breakdown.sauceModifier + 
      breakdown.addedToppingsPrice - 
      breakdown.removedToppingsCredit + 
      breakdown.intensityAdjustments, 
      0
    );
    
    return breakdown;
  };

  const calculateCartTotal = () => {
    return calculateSubtotal();
  };

  const handlePlaceOrder = async () => {
    if (!selection.size || !selection.crust || !selection.sauce || !data) {
      showToast('Please complete your pizza selection', { type: 'warning' });
      return;
    }

    // Create detailed toppings array
    const detailedToppings = selection.toppings.map(selectedTopping => {
      const topping = data.toppings.find(t => t.id === selectedTopping.toppingId);
      if (!topping) return null;
      
      const multiplier = selectedTopping.intensity === 'LIGHT' ? 0.75 : 
                        selectedTopping.intensity === 'EXTRA' ? 1.5 : 1;
      
      return {
        toppingId: topping.id,
        toppingName: topping.name,
        section: selectedTopping.section,
        intensity: selectedTopping.intensity,
        price: topping.price * multiplier
      };
    }).filter(Boolean) as any[];

    // Add to unified cart using the detailed pizza function
    addDetailedPizza({
      size: selection.size,
      crust: selection.crust,
      sauce: selection.sauce,
      sauceIntensity: selection.sauceIntensity,
      crustCookingLevel: selection.crustCookingLevel,
      toppings: detailedToppings,
      notes: notes,
      totalPrice: calculateTotal(),
      specialtyPizzaName: specialtyPizza?.name
    });
    
    // Create dynamic success message
    const pizzaDescription = generatePizzaDescription(selection, detailedToppings, specialtyPizza);
    const totalPrice = calculateTotal();
    
    // Show contextual success message
    showPizzaAddedMessage(pizzaDescription, totalPrice);
    
    // Reset the pizza builder for next item
    setSelection({
      size: null,
      crust: null,
      crustCookingLevel: 'REGULAR',
      sauce: null,
      toppings: [],
      sauceIntensity: 'REGULAR'
    });
    setNotes('');
    setActiveTab('SIZE');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading Pizza Builder...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600">Failed to load pizza data. Please refresh the page.</p>
        </div>
      </div>
    );
  }

  const groupedToppings = data.toppings.reduce((acc, topping) => {
    if (!acc[topping.category]) acc[topping.category] = [];
    acc[topping.category].push(topping);
    return acc;
  }, {} as Record<string, PizzaTopping[]>);

  // Category mapping for better display names
  const categoryMapping = {
    'CHEESE': 'CHEESE',
    'VEGETABLE': 'VEGGIE', 
    'MEAT': 'MEATS',
    'OTHER': 'OTHERS'
  };

  const toppingCategories = Object.keys(groupedToppings).map(category => ({
    id: category,
    label: categoryMapping[category as keyof typeof categoryMapping] || category
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-red-600 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center">
            <button className="mr-4 text-white hover:text-gray-200">
              ← Back to Menu
            </button>
            <h1 className="text-xl font-semibold">
              {specialtyPizza ? `🍕 Customize ${specialtyPizza.name}` : '🍕 Build Your Perfect Pizza'}
            </h1>
            {specialtyPizza ? (
              <p className="ml-2 text-red-200 text-sm">{specialtyPizza.description}</p>
            ) : (
              <p className="ml-2 text-red-200">Customize every detail exactly how you like it</p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-3xl font-bold">${(calculateTotal() || 0).toFixed(2)}</div>
              <div className="text-red-200 text-sm">Current Pizza</div>
            </div>
            {cartItems.length > 0 && (
              <>
                <div className="text-right">
                  <div className="text-2xl font-bold text-orange-400">${calculateCartTotal().toFixed(2)}</div>
                  <div className="text-orange-300 text-sm">Cart Total</div>
                </div>
                <button
                  onClick={() => {
                    // Convert selected toppings to detailed format
                    const cartToppings = selection.toppings.map(selectedTopping => {
                      const topping = data?.toppings.find(t => t.id === selectedTopping.toppingId);
                      return {
                        id: selectedTopping.toppingId,
                        name: topping?.name || 'Unknown Topping',
                        category: topping?.category || 'Unknown',
                        price: topping?.price || 0,
                        quantity: selectedTopping.quantity || 1,
                        section: selectedTopping.section,
                        isActive: topping?.isActive || true
                      };
                    });

                    // Add current pizza to cart using detailed function
                    addDetailedPizza({
                      size: selection.size,
                      crust: selection.crust,
                      sauce: selection.sauce,
                      sauceIntensity: selection.sauceIntensity,
                      crustCookingLevel: selection.crustCookingLevel,
                      toppings: cartToppings,
                      notes: notes || (specialtyPizza ? `Specialty Pizza: ${specialtyPizza.name}` : ''),
                      totalPrice: calculateTotal(),
                      specialtyPizzaName: specialtyPizza?.name
                    });
                    
                    // Show contextual success message
                    const pizzaDescription = generatePizzaDescription(selection, cartToppings, specialtyPizza);
                    const totalPrice = calculateTotal();
                    showPizzaAddedMessage(pizzaDescription, totalPrice);
                  }}
                  className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
                  disabled={!selection.size || !selection.crust || !selection.sauce}
                >
                  🛒 Add to Cart - ${calculateTotal().toFixed(2)}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Pizza Visualization */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-xl font-semibold text-center mb-6">
              {specialtyPizza ? `Customizing: ${specialtyPizza.name}` : 'Your Pizza Preview'}
            </h2>
            
            {/* Pizza Circle */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                {specialtyPizza && specialtyPizza.imageUrl ? (
                  /* Specialty Pizza Image */
                  <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-yellow-400 shadow-xl">
                    <img 
                      src={specialtyPizza.imageUrl} 
                      alt={specialtyPizza.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling!.classList.remove('hidden');
                      }}
                    />
                    {/* Fallback pizza visualization */}
                    <div className="hidden absolute inset-0">
                      {/* Outer glow */}
                      <div className="absolute inset-0 bg-yellow-200 rounded-full blur-lg opacity-50 scale-110"></div>
                      {/* Pizza base */}
                      <div className="relative w-full h-full bg-gradient-to-br from-yellow-300 via-orange-300 to-orange-400 rounded-full">
                        {/* Pizza slice icon in center */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <div className="text-6xl text-orange-600 opacity-60">🍕</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Default Pizza Visualization */
                  <div className="relative">
                    {/* Outer glow */}
                    <div className="absolute inset-0 bg-yellow-200 rounded-full blur-lg opacity-50 scale-110"></div>
                    {/* Pizza base */}
                    <div className="relative w-64 h-64 bg-gradient-to-br from-yellow-300 via-orange-300 to-orange-400 rounded-full border-4 border-yellow-400 shadow-xl">
                      {/* Pizza slice lines */}
                      <div className="absolute inset-4 border border-orange-400 rounded-full opacity-30"></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="w-0.5 h-24 bg-orange-400 opacity-40 rotate-0"></div>
                        <div className="w-0.5 h-24 bg-orange-400 opacity-40 rotate-45 absolute top-0"></div>
                        <div className="w-0.5 h-24 bg-orange-400 opacity-40 rotate-90 absolute top-0"></div>
                        <div className="w-0.5 h-24 bg-orange-400 opacity-40 rotate-135 absolute top-0"></div>
                      </div>
                      
                      {/* Pizza slice icon in center */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="text-6xl text-orange-600 opacity-60">🍕</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Specialty Pizza Info */}
            {specialtyPizza && (
              <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-4 mb-6">
                <div className="text-center">
                  <h3 className="font-semibold text-lg text-red-800 mb-2">Customizing Specialty Pizza</h3>
                  <p className="text-sm text-gray-700 mb-2">{specialtyPizza.description}</p>
                  <div className="text-xs text-gray-600">
                    Base Price ({selection.size?.name || 'Default'}): <span className="font-semibold text-red-600">
                      ${(() => {
                        if (selection.size) {
                          const sizeOption = specialtyPizza.availableSizes?.find(s => s.id === selection.size!.id);
                          return (sizeOption ? sizeOption.price : specialtyPizza.basePrice).toFixed(2);
                        }
                        return specialtyPizza.basePrice.toFixed(2);
                      })()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Pizza Details Summary */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">Size:</span>
                <span className="text-red-600">{selection.size?.name || 'Not selected'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Sauce:</span>
                <span className="text-red-600">{selection.sauce?.name || 'Not selected'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Cheese:</span>
                <span className="text-red-600">Normal</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Toppings:</span>
                <span className="text-red-600">{selection.toppings.length}</span>
              </div>
              <hr className="my-3" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-red-600">${(calculateTotal() || 0).toFixed(2)}</span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={!selection.size || !selection.crust || !selection.sauce}
              className="w-full mt-6 bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
              🛒 Add to Cart - ${(calculateTotal() || 0).toFixed(2)}
            </button>
          </div>

          {/* Right Side - Tabbed Interface */}
          <div className="bg-white rounded-lg shadow-lg">
            {/* Tab Headers */}
            <div className="flex border-b">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3 px-4 text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-red-600 text-white border-b-2 border-red-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* SIZE Tab */}
              {activeTab === 'SIZE' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Choose Your Size</h3>
                  <div className="space-y-3">
                    {specialtyPizza?.availableSizes ? (
                      // For specialty pizzas, use available sizes with pricing from the specialty pizza
                      specialtyPizza.availableSizes.map((size) => (
                        <button
                          key={size.id}
                          onClick={() => {
                            // Convert specialty size to PizzaSize format for selection
                            const matchingSize = data.sizes.find(s => s.id === size.id);
                            if (matchingSize) {
                              setSelection(prev => ({ ...prev, size: matchingSize }));
                            }
                          }}
                          className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                            selection.size?.id === size.id
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-semibold text-lg">{size.name}</div>
                              <div className="text-sm text-gray-600">({size.diameter})</div>
                              <div className="text-xs text-gray-500">Perfect for 1-2 people</div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-red-600">${size.price.toFixed(2)}</div>
                              {selection.size?.id === size.id && (
                                <div className="text-xs text-green-600 font-medium">Selected</div>
                              )}
                            </div>
                          </div>
                        </button>
                      ))
                    ) : (
                      // For custom pizzas, use regular pizza sizes
                      data.sizes.map((size) => (
                        <button
                          key={size.id}
                          onClick={() => setSelection(prev => ({ ...prev, size }))}
                          className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                            selection.size?.id === size.id
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-semibold text-lg">{size.name}</div>
                              <div className="text-sm text-gray-600">({size.diameter})</div>
                              <div className="text-xs text-gray-500">Perfect for 1-2 people</div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-red-600">${(size.basePrice || 0).toFixed(2)}</div>
                              {selection.size?.id === size.id && (
                                <div className="text-xs text-green-600 font-medium">Selected</div>
                              )}
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                  <div className="flex justify-between mt-6">
                    <button
                      disabled
                      className="px-6 py-2 bg-gray-200 text-gray-400 rounded-lg cursor-not-allowed"
                    >
                      ← Previous
                    </button>
                    <button
                      onClick={() => setActiveTab('SAUCE')}
                      disabled={!selection.size}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}

              {/* SAUCE Tab */}
              {activeTab === 'SAUCE' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Choose Your Sauce</h3>
                  <div className="space-y-3">
                    {data.sauces.map((sauce) => (
                      <button
                        key={sauce.id}
                        onClick={() => setSelection(prev => ({ ...prev, sauce }))}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                          selection.sauce?.id === sauce.id
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-4 h-4 rounded-full border border-gray-300"
                                style={{ backgroundColor: sauce.color }}
                              ></div>
                              <div className="font-semibold text-lg">{sauce.name}</div>
                            </div>
                            <div className="text-sm text-gray-600">{sauce.description}</div>
                            <div className="text-sm text-orange-600">
                              {'🌶️'.repeat(sauce.spiceLevel)} {sauce.spiceLevel === 0 ? 'Mild' : ''}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-red-600">
                              {(sauce.priceModifier || 0) > 0 ? `+$${(sauce.priceModifier || 0).toFixed(2)}` : 'Free'}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  {/* Sauce Intensity Selection */}
                  {selection.sauce && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-3">Sauce Intensity</h4>
                      <div className="flex space-x-3">
                        {(['LIGHT', 'REGULAR', 'EXTRA'] as const).map(intensity => (
                          <button
                            key={intensity}
                            onClick={() => updateSauceIntensity(intensity)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                              selection.sauceIntensity === intensity
                                ? 'bg-red-600 text-white'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {intensity.charAt(0) + intensity.slice(1).toLowerCase()}
                          </button>
                        ))}
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        {selection.sauceIntensity === 'LIGHT' && 'Light sauce coverage'}
                        {selection.sauceIntensity === 'REGULAR' && 'Standard sauce coverage'}
                        {selection.sauceIntensity === 'EXTRA' && 'Extra sauce coverage'}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex justify-between mt-6">
                    <button
                      onClick={() => setActiveTab('SIZE')}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      ← Previous
                    </button>
                    <button
                      onClick={() => setActiveTab('CRUST')}
                      disabled={!selection.sauce}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}

              {/* CRUST Tab */}
              {activeTab === 'CRUST' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Choose Your Crust</h3>
                  <div className="space-y-3">
                    {data.crusts.map((crust) => (
                      <button
                        key={crust.id}
                        onClick={() => setSelection(prev => ({ ...prev, crust }))}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                          selection.crust?.id === crust.id
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-semibold text-lg">{crust.name}</div>
                            <div className="text-sm text-gray-600">{crust.description}</div>
                            {crust.name === 'Regular Baked' && (
                              <div className="text-xs text-green-600 font-medium mt-1">Default</div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-red-600">
                              {(crust.priceModifier || 0) > 0 ? `+$${(crust.priceModifier || 0).toFixed(2)}` : 'Free'}
                            </div>
                            {selection.crust?.id === crust.id && (
                              <div className="text-xs text-green-600 font-medium">Selected</div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  {/* Cooking Level Selection */}
                  {selection.crust && (
                    <div className="mt-6">
                      <h4 className="font-medium mb-3">Cooking Level</h4>
                      <div className="grid grid-cols-3 gap-3">
                        {['LIGHT', 'REGULAR', 'WELL_DONE'].map((level) => (
                          <button
                            key={level}
                            onClick={() => setSelection(prev => ({ ...prev, crustCookingLevel: level as 'LIGHT' | 'REGULAR' | 'WELL_DONE' }))}
                            className={`p-3 rounded-lg border-2 text-center transition-all ${
                              selection.crustCookingLevel === level
                                ? 'border-red-500 bg-red-50'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <div className="font-medium">
                              {level === 'LIGHT' ? 'Lightly Baked' : 
                               level === 'REGULAR' ? 'Regular Baked' : 
                               'Well Done'}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              {level === 'LIGHT' ? 'Softer crust' : 
                               level === 'REGULAR' ? 'Classic bake (default)' : 
                               'Extra crispy'}
                            </div>
                            {level === 'REGULAR' && (
                              <div className="text-xs text-green-600 font-medium mt-1">Default</div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between mt-6">
                    <button
                      onClick={() => setActiveTab('SAUCE')}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      ← Previous
                    </button>
                    <button
                      onClick={() => setActiveTab('TOPPINGS')}
                      disabled={!selection.crust}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}

              {/* TOPPINGS Tab */}
              {activeTab === 'TOPPINGS' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Choose Your Toppings</h3>

                  {/* Topping Category Sub-tabs */}
                  <div className="mb-6">
                    <div className="flex space-x-1 border-b border-gray-200">
                      {toppingCategories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => setActiveToppingCategory(category.id)}
                          className={`px-4 py-2 font-medium text-sm transition-all border-b-2 ${
                            activeToppingCategory === category.id
                              ? 'border-red-600 text-red-600 bg-red-50'
                              : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                          }`}
                        >
                          {category.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Display toppings for active category */}
                  {groupedToppings[activeToppingCategory] && (
                    <div className="mb-6">
                      {/* Specialty Pizza Changes Summary */}
                      {specialtyPizza && (
                        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <h4 className="font-semibold text-blue-800 mb-2">🍕 Customizing {specialtyPizza.name}</h4>
                          <p className="text-sm text-blue-700 mb-2">Original toppings are marked with ⭐. You can remove or modify them, and add new ones.</p>
                          {(() => {
                            const changes = getSpecialtyPizzaChanges();
                            const hasChanges = changes.addedToppings.length > 0 || changes.removedToppings.length > 0 || changes.modifiedToppings.length > 0;
                            
                            if (hasChanges) {
                              return (
                                <div className="text-sm space-y-1">
                                  {changes.addedToppings.length > 0 && (
                                    <div className="text-green-700">
                                      ➕ <strong>Added:</strong> {changes.addedToppings.map(t => `${t.toppingName} (${t.section})`).join(', ')}
                                    </div>
                                  )}
                                  {changes.removedToppings.length > 0 && (
                                    <div className="text-red-700">
                                      ➖ <strong>Removed:</strong> {changes.removedToppings.map(t => `${t.toppingName} (${t.section})`).join(', ')}
                                    </div>
                                  )}
                                  {changes.modifiedToppings.length > 0 && (
                                    <div className="text-orange-700">
                                      ⚙️ <strong>Modified:</strong> {changes.modifiedToppings.map(t => `${t.toppingName} (${t.originalIntensity.toLowerCase()} → ${t.newIntensity.toLowerCase()})`).join(', ')}
                                    </div>
                                  )}
                                </div>
                              );
                            } else {
                              return <div className="text-sm text-blue-600">No changes made yet - this will be the original {specialtyPizza.name}</div>;
                            }
                          })()}
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 gap-4">
                        {groupedToppings[activeToppingCategory].map((topping) => {
                          // Check if this topping is original to the specialty pizza
                          const isOriginalTopping = specialtyPizza && originalSpecialtyToppings.some(t => t.toppingId === topping.id);
                          
                          return (
                            <div key={topping.id} className={`border-2 rounded-lg p-4 hover:border-gray-300 transition-all ${
                              isOriginalTopping 
                                ? 'border-blue-300 bg-blue-50' 
                                : 'border-gray-200'
                            }`}>
                              {/* Topping Info */}
                              <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center gap-2">
                                  <div className="font-medium text-lg">
                                    {isOriginalTopping && '⭐ '}
                                    {topping.name}
                                  </div>
                                  {isOriginalTopping && (
                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                      Original
                                    </span>
                                  )}
                                  <div className="text-sm text-gray-500">
                                    {topping.isVegan && '🌱 '}
                                    {topping.isVegetarian && !topping.isVegan && '🥬 '}
                                  </div>
                                </div>
                                <div className="text-red-600 font-bold">
                                  {(() => {
                                    if (isOriginalTopping && specialtyPizza) {
                                      // For original toppings, show potential credit for removal
                                      const originalToppingConfig = originalSpecialtyToppings.find(t => t.toppingId === topping.id);
                                      if (originalToppingConfig) {
                                        const intensityMultiplier = originalToppingConfig.intensity === 'LIGHT' ? 0.75 : 
                                                                  originalToppingConfig.intensity === 'EXTRA' ? 1.5 : 1;
                                        const credit = topping.price * intensityMultiplier * 0.5;
                                        return (
                                          <div className="text-right">
                                            <div className="text-blue-600">Included</div>
                                            <div className="text-xs text-red-500">-${credit.toFixed(2)} if removed</div>
                                          </div>
                                        );
                                      }
                                      return 'Included';
                                    } else {
                                      // For new toppings, show the additional cost
                                      return `+$${(topping.price || 0).toFixed(2)}`;
                                    }
                                  })()}
                                </div>
                              </div>
                              
                              {/* Section Selector for this topping */}
                              <div className="flex space-x-2">
                                {(['WHOLE', 'LEFT', 'RIGHT'] as const).map((section) => {
                                  const isSelected = selection.toppings.some(t => t.toppingId === topping.id && t.section === section);
                                  const wasOriginallyOnSection = originalSpecialtyToppings.some(t => t.toppingId === topping.id && t.section === section);
                                  
                                  return (
                                    <button
                                      key={section}
                                      onClick={() => toggleTopping(topping, section)}
                                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                                        isSelected
                                          ? wasOriginallyOnSection
                                            ? 'bg-blue-600 text-white shadow-md' // Original topping, still selected
                                            : 'bg-red-600 text-white shadow-md'   // New topping, selected
                                          : wasOriginallyOnSection
                                            ? 'bg-red-100 text-red-700 border-2 border-red-300 hover:bg-red-200' // Original topping, removed
                                            : 'bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-700' // Normal unselected
                                      }`}
                                    >
                                      {section}
                                      {wasOriginallyOnSection && !isSelected && ' ❌'}
                                      {!wasOriginallyOnSection && isSelected && ' ➕'}
                                    </button>
                                  );
                                })}
                              </div>

                              {/* Intensity Selector for selected toppings */}
                              {(['WHOLE', 'LEFT', 'RIGHT'] as const).map((section) => {
                                const selectedTopping = selection.toppings.find(t => t.toppingId === topping.id && t.section === section);
                                const originalTopping = originalSpecialtyToppings.find(t => t.toppingId === topping.id && t.section === section);
                                if (!selectedTopping) return null;
                                
                                return (
                                  <div key={`${topping.id}-${section}-intensity`} className="mt-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="text-sm font-medium text-gray-700 mb-2">
                                      {section} - Intensity
                                      {originalTopping && originalTopping.intensity !== selectedTopping.intensity && (
                                        <span className="ml-2 text-xs text-orange-600">
                                          (Changed from {originalTopping.intensity.toLowerCase()})
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex space-x-2">
                                      {(['LIGHT', 'REGULAR', 'EXTRA'] as const).map(intensity => {
                                        const intensityMultiplier = intensity === 'LIGHT' ? 0.75 : intensity === 'EXTRA' ? 1.5 : 1;
                                        let priceDisplay = '';
                                        
                                        if (originalTopping && specialtyPizza) {
                                          // Show pricing impact for specialty pizza intensity changes
                                          const originalMultiplier = originalTopping.intensity === 'LIGHT' ? 0.75 : 
                                                                   originalTopping.intensity === 'EXTRA' ? 1.5 : 1;
                                          const priceDiff = topping.price * (intensityMultiplier - originalMultiplier);
                                          
                                          if (priceDiff > 0) {
                                            priceDisplay = `+$${priceDiff.toFixed(2)}`;
                                          } else if (priceDiff < 0) {
                                            priceDisplay = `-$${Math.abs(priceDiff).toFixed(2)}`;
                                          } else {
                                            priceDisplay = '';
                                          }
                                        } else if (!originalTopping) {
                                          // Show pricing for new toppings
                                          const price = topping.price * intensityMultiplier;
                                          priceDisplay = intensity === 'REGULAR' ? '' : `($${price.toFixed(2)})`;
                                        }
                                        
                                        return (
                                          <div key={intensity} className="flex flex-col items-center">
                                            <button
                                              onClick={() => updateToppingIntensity(topping.id, section, intensity)}
                                              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                                                selectedTopping.intensity === intensity
                                                  ? originalTopping?.intensity === intensity
                                                    ? 'bg-blue-600 text-white' // Original intensity
                                                    : 'bg-orange-600 text-white' // Modified intensity
                                                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                              }`}
                                            >
                                              {intensity.charAt(0) + intensity.slice(1).toLowerCase()}
                                              {originalTopping?.intensity === intensity && selectedTopping.intensity === intensity && ' ⭐'}
                                            </button>
                                            {priceDisplay && (
                                              <span className={`text-xs mt-1 ${
                                                priceDisplay.startsWith('+') ? 'text-red-600' : 
                                                priceDisplay.startsWith('-') ? 'text-green-600' : 'text-gray-500'
                                              }`}>
                                                {priceDisplay}
                                              </span>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between mt-6">
                    <button
                      onClick={() => setActiveTab('CRUST')}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      ← Previous
                    </button>
                    <button
                      onClick={() => setActiveTab('REVIEW')}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}

              {/* REVIEW Tab */}
              {activeTab === 'REVIEW' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Review Your Order</h3>
                  <div className="space-y-4">
                    {/* Specialty Pizza Changes Summary */}
                    {specialtyPizza && (
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-medium text-blue-800 mb-2">🍕 {specialtyPizza.name} Customization</h4>
                        {(() => {
                          const changes = getSpecialtyPizzaChanges();
                          const hasChanges = changes.addedToppings.length > 0 || changes.removedToppings.length > 0 || changes.modifiedToppings.length > 0;
                          
                          if (!hasChanges) {
                            return (
                              <div className="text-sm text-blue-600">
                                ✅ This will be the original {specialtyPizza.name} recipe with no modifications
                              </div>
                            );
                          }
                          
                          return (
                            <div className="text-sm space-y-2">
                              <div className="text-blue-700 mb-2">Your customizations:</div>
                              {changes.addedToppings.length > 0 && (
                                <div className="text-green-700">
                                  <strong>➕ Added Toppings:</strong>
                                  <ul className="ml-4 list-disc">
                                    {changes.addedToppings.map((t, i) => (
                                      <li key={i}>{t.toppingName} ({t.section.toLowerCase()}, {t.intensity.toLowerCase()})</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {changes.removedToppings.length > 0 && (
                                <div className="text-red-700">
                                  <strong>➖ Removed Toppings:</strong>
                                  <ul className="ml-4 list-disc">
                                    {changes.removedToppings.map((t, i) => (
                                      <li key={i}>{t.toppingName} ({t.section.toLowerCase()})</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {changes.modifiedToppings.length > 0 && (
                                <div className="text-orange-700">
                                  <strong>⚙️ Modified Toppings:</strong>
                                  <ul className="ml-4 list-disc">
                                    {changes.modifiedToppings.map((t, i) => (
                                      <li key={i}>{t.toppingName} intensity changed from {t.originalIntensity.toLowerCase()} to {t.newIntensity.toLowerCase()}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    )}
                    
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Order Summary</h4>
                      <div className="space-y-2 text-sm">
                        {/* Base pricing */}
                        {(() => {
                          const breakdown = getPricingBreakdown();
                          if (!breakdown) return null;
                          
                          return (
                            <>
                              <div className="flex justify-between">
                                <span>{breakdown.baseName}</span>
                                <span>${breakdown.basePrice.toFixed(2)}</span>
                              </div>
                              
                              {/* Crust and sauce modifiers for regular pizzas */}
                              {breakdown.crustModifier > 0 && (
                                <div className="flex justify-between">
                                  <span>Crust upgrade</span>
                                  <span>+${breakdown.crustModifier.toFixed(2)}</span>
                                </div>
                              )}
                              {breakdown.sauceModifier > 0 && (
                                <div className="flex justify-between">
                                  <span>Sauce upgrade</span>
                                  <span>+${breakdown.sauceModifier.toFixed(2)}</span>
                                </div>
                              )}
                              
                              {/* Specialty pizza adjustments */}
                              {specialtyPizza && (
                                <>
                                  {breakdown.addedToppingsPrice > 0 && (
                                    <div className="flex justify-between text-green-700">
                                      <span>➕ Added toppings</span>
                                      <span>+${breakdown.addedToppingsPrice.toFixed(2)}</span>
                                    </div>
                                  )}
                                  {breakdown.removedToppingsCredit > 0 && (
                                    <div className="flex justify-between text-red-700">
                                      <span>➖ Removed toppings credit (50%)</span>
                                      <span>-${breakdown.removedToppingsCredit.toFixed(2)}</span>
                                    </div>
                                  )}
                                  {breakdown.intensityAdjustments !== 0 && (
                                    <div className={`flex justify-between ${breakdown.intensityAdjustments > 0 ? 'text-orange-700' : 'text-blue-700'}`}>
                                      <span>⚙️ Intensity adjustments</span>
                                      <span>{breakdown.intensityAdjustments > 0 ? '+' : ''}${breakdown.intensityAdjustments.toFixed(2)}</span>
                                    </div>
                                  )}
                                </>
                              )}
                              
                              {/* Regular pizza toppings */}
                              {!specialtyPizza && breakdown.addedToppingsPrice > 0 && (
                                <div className="flex justify-between">
                                  <span>Toppings</span>
                                  <span>+${breakdown.addedToppingsPrice.toFixed(2)}</span>
                                </div>
                              )}
                            </>
                          );
                        })()}
                        
                        <hr className="my-2" />
                        
                        {/* Individual toppings breakdown */}
                        {selection.toppings.map((selectedTopping) => {
                          const topping = data?.toppings.find(t => t.id === selectedTopping.toppingId);
                          if (!topping) return null;
                          
                          // Check if this is an original topping
                          const isOriginal = originalSpecialtyToppings.some(t => 
                            t.toppingId === selectedTopping.toppingId && 
                            t.section === selectedTopping.section
                          );
                          
                          const originalTopping = originalSpecialtyToppings.find(t => 
                            t.toppingId === selectedTopping.toppingId && 
                            t.section === selectedTopping.section
                          );
                          
                          const intensityMultiplier = selectedTopping.intensity === 'LIGHT' ? 0.75 : 
                                                    selectedTopping.intensity === 'EXTRA' ? 1.5 : 1;
                          
                          let priceDisplay = '';
                          let textColor = '';
                          
                          if (specialtyPizza) {
                            if (isOriginal) {
                              if (originalTopping && originalTopping.intensity !== selectedTopping.intensity) {
                                // Modified intensity
                                const originalMultiplier = originalTopping.intensity === 'LIGHT' ? 0.75 : 
                                                         originalTopping.intensity === 'EXTRA' ? 1.5 : 1;
                                const priceDiff = topping.price * (intensityMultiplier - originalMultiplier);
                                priceDisplay = priceDiff > 0 ? `+$${priceDiff.toFixed(2)}` : `-$${Math.abs(priceDiff).toFixed(2)}`;
                                textColor = priceDiff > 0 ? 'text-orange-600' : 'text-blue-600';
                              } else {
                                // Original topping, no change
                                priceDisplay = 'Included';
                                textColor = 'text-gray-600';
                              }
                            } else {
                              // Added topping
                              priceDisplay = `+$${(topping.price * intensityMultiplier).toFixed(2)}`;
                              textColor = 'text-green-600';
                            }
                          } else {
                            // Regular pizza
                            priceDisplay = `$${(topping.price * intensityMultiplier).toFixed(2)}`;
                            textColor = 'text-gray-800';
                          }
                          
                          return (
                            <div key={`${selectedTopping.toppingId}-${selectedTopping.section}`} className="flex justify-between text-xs">
                              <span className="flex items-center">
                                {isOriginal && specialtyPizza && '⭐ '}
                                {topping.name} ({selectedTopping.section}, {selectedTopping.intensity.toLowerCase()})
                                {originalTopping && originalTopping.intensity !== selectedTopping.intensity && (
                                  <span className="ml-1 text-orange-500">
                                    (was {originalTopping.intensity.toLowerCase()})
                                  </span>
                                )}
                              </span>
                              <span className={textColor}>{priceDisplay}</span>
                            </div>
                          );
                        })}
                        
                        {/* Show removed toppings */}
                        {specialtyPizza && (() => {
                          const changes = getSpecialtyPizzaChanges();
                          return changes.removedToppings.map((removedTopping, index) => {
                            const topping = data?.toppings.find(t => t.id === removedTopping.toppingId);
                            if (!topping) return null;
                            
                            const intensityMultiplier = removedTopping.intensity === 'LIGHT' ? 0.75 : 
                                                      removedTopping.intensity === 'EXTRA' ? 1.5 : 1;
                            const credit = topping.price * intensityMultiplier * 0.5;
                            
                            return (
                              <div key={`removed-${index}`} className="flex justify-between text-xs">
                                <span className="text-red-600">
                                  ❌ {topping.name} ({removedTopping.section}, {removedTopping.intensity.toLowerCase()}) - REMOVED
                                </span>
                                <span className="text-red-600">-${credit.toFixed(2)}</span>
                              </div>
                            );
                          });
                        })()}
                        
                        <hr />
                        <div className="flex justify-between font-bold text-lg">
                          <span>Total:</span>
                          <span className="text-red-600">${(calculateTotal() || 0).toFixed(2)}</span>
                        </div>
                        
                        {/* Savings indicator */}
                        {specialtyPizza && (() => {
                          const breakdown = getPricingBreakdown();
                          if (breakdown && breakdown.removedToppingsCredit > 0) {
                            return (
                              <div className="text-sm text-green-600 font-medium">
                                💰 You saved ${breakdown.removedToppingsCredit.toFixed(2)} by removing toppings!
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    </div>
                    
                    {/* Special Instructions */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Special Instructions (Optional)</h4>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Any special requests or cooking instructions..."
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between mt-6">
                    <button
                      onClick={() => setActiveTab('TOPPINGS')}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      ← Previous
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={!selection.size || !selection.crust || !selection.sauce}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
