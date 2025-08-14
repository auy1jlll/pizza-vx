'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';

interface SpecialtyPizzaSize {
  id: string;
  price: number;
  isAvailable: boolean;
  pizzaSize: {
    id: string;
    name: string;
    diameter: string;
  };
}

interface SpecialtyPizza {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  isActive: boolean;
  category: string;
  imageUrl?: string;
  ingredients: string[];
  sizes?: SpecialtyPizzaSize[];
  createdAt: string;
  updatedAt: string;
}

export default function SpecialtyPizzasAdmin() {
  const [pizzas, setPizzas] = useState<SpecialtyPizza[]>([]);
  const [availableSizes, setAvailableSizes] = useState<{id: string, name: string, diameter: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPizza, setEditingPizza] = useState<SpecialtyPizza | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    basePrice: 0,
    category: 'CLASSIC',
    imageUrl: '',
    ingredients: [] as string[],
    isActive: true
  });
  const [sizePricing, setSizePricing] = useState<Record<string, { price: number, isAvailable: boolean }>>({});

  // Pizza categories
  const categories = [
    'CLASSIC',
    'PREMIUM',
    'VEGETARIAN',
    'VEGAN',
    'MEAT_LOVERS',
    'SPECIALTY'
  ];

  // Fetch specialty pizzas
  const fetchPizzas = async () => {
    try {
      const response = await fetch('/api/admin/specialty-pizzas');
      if (response.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      if (response.ok) {
        const data = await response.json();
        setPizzas(Array.isArray(data) ? data : []);
      } else {
        console.error('Failed to fetch specialty pizzas');
        setPizzas([]);
      }
    } catch (error) {
      console.error('Error fetching specialty pizzas:', error);
      setPizzas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPizzas();
    fetchSizes();
  }, []);

  // Fetch available pizza sizes
  const fetchSizes = async () => {
    try {
      const response = await fetch('/api/admin/sizes');
      if (response.ok) {
        const data = await response.json();
        setAvailableSizes(data);
        
        // Initialize default pricing for all sizes
        const defaultPricing: Record<string, { price: number, isAvailable: boolean }> = {};
        data.forEach((size: any) => {
          defaultPricing[size.id] = { price: 0, isAvailable: true };
        });
        setSizePricing(defaultPricing);
      }
    } catch (error) {
      console.error('Error fetching sizes:', error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingPizza ? `/api/admin/specialty-pizzas/${editingPizza.id}` : '/api/admin/specialty-pizzas';
      const method = editingPizza ? 'PUT' : 'POST';
      
      // Prepare submission data with size pricing
      const submissionData = {
        ...formData,
        sizePricing: sizePricing
      };
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (response.ok) {
        await fetchPizzas();
        setShowForm(false);
        setEditingPizza(null);
        setFormData({ 
          name: '', 
          description: '', 
          basePrice: 0, 
          category: 'CLASSIC', 
          imageUrl: '', 
          ingredients: [],
          isActive: true 
        });
        // Reset size pricing to defaults
        const defaultPricing: Record<string, { price: number, isAvailable: boolean }> = {};
        availableSizes.forEach((size) => {
          defaultPricing[size.id] = { price: 0, isAvailable: true };
        });
        setSizePricing(defaultPricing);
      }
    } catch (error) {
      console.error('Error saving specialty pizza:', error);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this specialty pizza?')) return;
    
    try {
      const response = await fetch(`/api/admin/specialty-pizzas/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchPizzas();
      }
    } catch (error) {
      console.error('Error deleting specialty pizza:', error);
    }
  };

  // Handle edit
  const handleEdit = (pizza: SpecialtyPizza) => {
    setEditingPizza(pizza);
    setFormData({
      name: pizza.name,
      description: pizza.description,
      basePrice: pizza.basePrice,
      category: pizza.category,
      imageUrl: pizza.imageUrl || '',
      ingredients: pizza.ingredients,
      isActive: pizza.isActive
    });
    
    // Load existing size pricing
    const existingSizePricing: Record<string, { price: number, isAvailable: boolean }> = {};
    availableSizes.forEach(size => {
      const existingSize = pizza.sizes?.find(s => s.pizzaSize.id === size.id);
      if (existingSize) {
        existingSizePricing[size.id] = {
          price: existingSize.price,
          isAvailable: existingSize.isAvailable
        };
      } else {
        existingSizePricing[size.id] = { price: 0, isAvailable: true };
      }
    });
    setSizePricing(existingSizePricing);
    
    setShowForm(true);
  };

  // Add ingredient
  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, '']
    }));
  };

  // Update ingredient
  const updateIngredient = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) => i === index ? value : ing)
    }));
  };

  // Remove ingredient
  const removeIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  // Group pizzas by category
  const groupedPizzas = pizzas.reduce((acc, pizza) => {
    if (!acc[pizza.category]) {
      acc[pizza.category] = [];
    }
    acc[pizza.category].push(pizza);
    return acc;
  }, {} as Record<string, SpecialtyPizza[]>);

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-white">Specialty Pizzas</h1>
            <p className="mt-2 text-sm text-gray-300">
              Manage your signature specialty pizzas with custom ingredients and pricing.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              onClick={() => {
                setShowForm(true);
                setEditingPizza(null);
                setFormData({ 
                  name: '', 
                  description: '', 
                  basePrice: 0, 
                  category: 'CLASSIC', 
                  imageUrl: '', 
                  ingredients: [],
                  isActive: true 
                });
              }}
              className="block rounded-md bg-gradient-to-r from-orange-500 to-pink-500 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:from-orange-600 hover:to-pink-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
            >
              Add New Specialty Pizza
            </button>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-slate-800 border border-slate-600 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <h2 className="text-xl font-bold mb-4 text-white">
                {editingPizza ? 'Edit Specialty Pizza' : 'Add New Specialty Pizza'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Pizza Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full border border-gray-600 bg-slate-700 text-white rounded px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="e.g., Margherita Supreme"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full border border-gray-600 bg-slate-700 text-white rounded px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>
                          {cat.replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full border border-gray-600 bg-slate-700 text-white rounded px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    rows={3}
                    placeholder="Describe this specialty pizza..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Base Price ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.basePrice}
                      onChange={(e) => setFormData(prev => ({ ...prev, basePrice: parseFloat(e.target.value) || 0 }))}
                      className="w-full border border-gray-600 bg-slate-700 text-white rounded px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Image URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                      className="w-full border border-gray-600 bg-slate-700 text-white rounded px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                {/* Ingredients Section */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Ingredients
                    </label>
                    <button
                      type="button"
                      onClick={addIngredient}
                      className="text-sm bg-slate-600 hover:bg-slate-500 text-white px-2 py-1 rounded border border-gray-600"
                    >
                      Add Ingredient
                    </button>
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {formData.ingredients.map((ingredient, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={ingredient}
                          onChange={(e) => updateIngredient(index, e.target.value)}
                          className="flex-1 border border-gray-600 bg-slate-700 text-white rounded px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="e.g., Fresh mozzarella"
                        />
                        <button
                          type="button"
                          onClick={() => removeIngredient(index)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Size Pricing Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Size Pricing
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {availableSizes.map((size) => (
                      <div key={size.id} className="border border-gray-600 rounded-lg p-4 bg-slate-700/50">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-white">
                            {size.name} ({size.diameter})
                          </h4>
                          <input
                            type="checkbox"
                            checked={sizePricing[size.id]?.isAvailable || false}
                            onChange={(e) => setSizePricing(prev => ({
                              ...prev,
                              [size.id]: {
                                ...prev[size.id],
                                isAvailable: e.target.checked
                              }
                            }))}
                            className="bg-slate-700 border-gray-600 rounded focus:ring-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">
                            Price ($)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={sizePricing[size.id]?.price || 0}
                            onChange={(e) => setSizePricing(prev => ({
                              ...prev,
                              [size.id]: {
                                ...prev[size.id],
                                price: parseFloat(e.target.value) || 0
                              }
                            }))}
                            className="w-full border border-gray-600 bg-slate-700 text-white rounded px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            placeholder="0.00"
                            disabled={!sizePricing[size.id]?.isAvailable}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="mr-2 bg-slate-700 border-gray-600 rounded focus:ring-orange-500"
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-300">
                    Available for ordering
                  </label>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white py-2 rounded hover:from-orange-600 hover:to-pink-600 transition-all duration-300"
                  >
                    {editingPizza ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-slate-600 hover:bg-slate-500 text-white py-2 rounded transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Specialty Pizzas List */}
        <div className="mt-8">
          {loading ? (
            <div className="text-center py-8 text-white">Loading...</div>
          ) : pizzas.length === 0 ? (
            <div className="text-center py-8 text-gray-300">
              No specialty pizzas found. Create your first signature pizza to get started.
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedPizzas).map(([category, categoryPizzas]) => (
                <div key={category} className="overflow-hidden shadow-xl ring-1 ring-white/20 md:rounded-lg bg-slate-800/90">
                  <div className="bg-gradient-to-r from-orange-500/30 to-pink-500/30 px-6 py-4">
                    <h3 className="text-lg font-semibold text-white">
                      {category.replace('_', ' ')} ({categoryPizzas.length})
                    </h3>
                  </div>
                  
                  <div className="bg-slate-900/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                      {categoryPizzas.map((pizza) => (
                        <div key={pizza.id} className={`border rounded-lg p-4 transition-all duration-300 hover:scale-105 ${!pizza.isActive ? 'opacity-50 bg-slate-700/60 border-slate-600' : 'bg-slate-700/80 border-slate-600 hover:bg-slate-600/80'}`}>
                          {pizza.imageUrl && (
                            <img 
                              src={pizza.imageUrl} 
                              alt={pizza.name}
                              className="w-full h-32 object-cover rounded-lg mb-4"
                            />
                          )}
                          <div className="space-y-2">
                            <div className="flex justify-between items-start">
                              <h4 className="font-semibold text-white">{pizza.name}</h4>
                              <span className={`text-sm px-2 py-1 rounded ${pizza.isActive ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
                                {pizza.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-300">{pizza.description}</p>
                            <div className="text-lg font-bold text-green-400">
                              Base: ${pizza.basePrice.toFixed(2)}
                            </div>
                            
                            {/* Size Options */}
                            {pizza.sizes && pizza.sizes.length > 0 && (
                              <div className="mt-2">
                                <div className="text-xs text-gray-400 mb-1">
                                  <strong className="text-gray-300">Size Options:</strong>
                                </div>
                                <div className="grid grid-cols-3 gap-1">
                                  {pizza.sizes.map((sizeOption) => (
                                    <div
                                      key={sizeOption.id}
                                      className="bg-slate-600/50 border border-slate-500 rounded p-1 text-xs text-center"
                                    >
                                      <div className="font-semibold text-white">
                                        {sizeOption.pizzaSize.name}
                                      </div>
                                      <div className="text-green-400 font-bold">
                                        ${sizeOption.price.toFixed(2)}
                                      </div>
                                      <div className="text-gray-400 text-xs">
                                        {sizeOption.pizzaSize.diameter}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {pizza.ingredients.length > 0 && (
                              <div className="text-xs text-gray-400 mt-2">
                                <strong className="text-gray-300">Ingredients:</strong> {pizza.ingredients.join(', ')}
                              </div>
                            )}
                            <div className="flex space-x-2 mt-4">
                              <button
                                onClick={() => handleEdit(pizza)}
                                className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 hover:border-blue-500/50 py-1 px-2 rounded text-sm transition-all duration-300"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(pizza.id)}
                                className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 hover:border-red-500/50 py-1 px-2 rounded text-sm transition-all duration-300"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
