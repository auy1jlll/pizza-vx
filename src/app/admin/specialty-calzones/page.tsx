'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useToast } from '@/components/ToastProvider';

interface SpecialtyCalzoneSize {
  id: string;
  price: number;
  isAvailable: boolean;
  pizzaSize: {
    id: string;
    name: string;
    diameter: string;
  };
}

interface SpecialtyCalzoneTopping {
  id: string;
  name: string;
  category: string;
  priceModifier: number;
  isActive: boolean;
}

interface SpecialtyCalzone {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  isActive: boolean;
  category: string;
  imageUrl?: string;
  ingredients: string[];
  toppings?: string[];
  sizes?: SpecialtyCalzoneSize[];
  createdAt: string;
  updatedAt: string;
}

export default function SpecialtyCalzonesAdmin() {
  const [calzones, setCalzones] = useState<SpecialtyCalzone[]>([]);
  const [availableSizes, setAvailableSizes] = useState<{id: string, name: string, diameter: string}[]>([]);
  const [availableToppings, setAvailableToppings] = useState<SpecialtyCalzoneTopping[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCalzone, setEditingCalzone] = useState<SpecialtyCalzone | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    basePrice: 0,
    category: 'CLASSIC',
    imageUrl: '',
    ingredients: [] as string[],
    toppings: [] as string[],
    isActive: true
  });
  const [sizePricing, setSizePricing] = useState<Record<string, { price: number, isAvailable: boolean }>>({});
  const { show: showToast } = useToast();

  // Calzone categories
  const categories = [
    'CLASSIC',
    'PREMIUM',
    'VEGETARIAN',
    'VEGAN',
    'MEAT_LOVERS',
    'SPECIALTY'
  ];

  // Fetch specialty calzones
  const fetchCalzones = async () => {
    try {
      const response = await fetch('/api/admin/specialty-calzones');
      if (response.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      if (response.ok) {
        const data = await response.json();
        setCalzones(Array.isArray(data) ? data : []);
      } else {
        console.error('Failed to fetch specialty calzones');
        setCalzones([]);
      }
    } catch (error) {
      console.error('Error fetching specialty calzones:', error);
      setCalzones([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalzones();
    fetchSizes();
    fetchToppings();
  }, []);

  // Fetch available calzone sizes
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

  // Fetch available fillings (toppings)
  const fetchToppings = async () => {
    try {
      const response = await fetch('/api/admin/toppings');
      if (response.ok) {
        const data = await response.json();
        setAvailableToppings(data);
      }
    } catch (error) {
      console.error('Error fetching toppings:', error);
    }
  };

  // Handle image upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      const result = await response.json();

      if (response.ok) {
        setFormData(prev => ({ ...prev, imageUrl: result.imageUrl }));
        showToast('Image uploaded successfully! 📸', { type: 'success' });
      } else {
        showToast(result.error || 'Failed to upload image', { type: 'error' });
      }
    } catch (error) {
      console.error('Upload error:', error);
      showToast('Failed to upload image', { type: 'error' });
    } finally {
      setImageUploading(false);
    }
  };

  // Remove uploaded image
  const removeImage = () => {
    setFormData(prev => ({ ...prev, imageUrl: '' }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = '/api/admin/specialty-calzones';
      const method = editingCalzone ? 'PUT' : 'POST';
      
      // Prepare submission data with size pricing
      const submissionData: any = {
        ...formData,
        sizePricing: sizePricing
      };

      // Add ID for updates
      if (editingCalzone) {
        submissionData.id = editingCalzone.id;
      }
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (response.ok) {
        await fetchCalzones();
        setShowForm(false);
        setEditingCalzone(null);
        setFormData({ 
          name: '', 
          description: '', 
          basePrice: 0, 
          category: 'CLASSIC', 
          imageUrl: '', 
          ingredients: [],
          toppings: [],
          isActive: true 
        });
        showToast(
          editingCalzone ? 'Calzone updated successfully!' : 'Calzone created successfully!', 
          { type: 'success' }
        );
      } else {
        const errorData = await response.json();
        showToast(errorData.error || 'Failed to save calzone', { type: 'error' });
      }
    } catch (error) {
      console.error('Error saving calzone:', error);
      showToast('Failed to save calzone', { type: 'error' });
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this calzone?')) return;

    try {
      const response = await fetch(`/api/admin/specialty-calzones?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showToast('Calzone deleted successfully!', { type: 'success' });
        fetchCalzones();
      } else {
        showToast('Failed to delete calzone', { type: 'error' });
      }
    } catch (error) {
      console.error('Error deleting calzone:', error);
      showToast('Failed to delete calzone', { type: 'error' });
    }
  };

  // Handle edit
  const handleEdit = (calzone: SpecialtyCalzone) => {
    setEditingCalzone(calzone);
    setFormData({
      name: calzone.name,
      description: calzone.description,
      basePrice: calzone.basePrice,
      category: calzone.category,
      imageUrl: calzone.imageUrl || '',
      ingredients: Array.isArray(calzone.ingredients) ? calzone.ingredients : 
                  typeof calzone.ingredients === 'string' ? 
                  (calzone.ingredients as string).split(',').map((s: string) => s.trim()).filter(Boolean) : [],
      toppings: calzone.toppings || [],
      isActive: calzone.isActive
    });

    // Set size pricing from existing data
    if (calzone.sizes) {
      const existingSizePricing: Record<string, { price: number, isAvailable: boolean }> = {};
      calzone.sizes.forEach(size => {
        existingSizePricing[size.pizzaSize.id] = {
          price: size.price,
          isAvailable: size.isAvailable
        };
      });
      setSizePricing(existingSizePricing);
    }

    setShowForm(true);
  };

  // Add ingredient
  const addIngredient = () => {
    const ingredient = prompt('Enter filling:');
    if (ingredient?.trim()) {
      setFormData(prev => ({
        ...prev,
        ingredients: [...prev.ingredients, ingredient.trim()]
      }));
    }
  };

  // Remove ingredient
  const removeIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  // Handle size pricing change
  const handleSizePricingChange = (sizeId: string, field: 'price' | 'isAvailable', value: number | boolean) => {
    setSizePricing(prev => ({
      ...prev,
      [sizeId]: {
        ...prev[sizeId],
        [field]: value
      }
    }));
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
        </div>
      </AdminLayout>
    );
  }

  // Group calzones by category
  const groupedCalzones = calzones.reduce((acc, calzone) => {
    if (!acc[calzone.category]) {
      acc[calzone.category] = [];
    }
    acc[calzone.category].push(calzone);
    return acc;
  }, {} as Record<string, SpecialtyCalzone[]>);

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-white">Specialty Calzones</h1>
            <p className="mt-2 text-sm text-gray-300">
              Manage your signature specialty calzones with custom fillings and pricing.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              onClick={() => {
                setShowForm(true);
                setEditingCalzone(null);
                setFormData({ 
                  name: '', 
                  description: '', 
                  basePrice: 0, 
                  category: 'CLASSIC', 
                  imageUrl: '', 
                  ingredients: [],
                  toppings: [],
                  isActive: true 
                });
              }}
              className="block rounded-md bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:from-amber-600 hover:to-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
            >
              Add New Specialty Calzone
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6 border-b border-slate-600">
          <nav className="-mb-px flex space-x-8">
            <a
              href="/admin/specialty-pizzas"
              className="border-transparent text-gray-400 hover:border-gray-300 hover:text-gray-300 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors"
            >
              Specialty Pizzas
            </a>
            <div className="border-amber-500 text-amber-400 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium">
              Specialty Calzones ({calzones.length})
            </div>
          </nav>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-slate-800 border border-slate-600 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <h2 className="text-xl font-bold mb-4 text-white">
                {editingCalzone ? 'Edit Specialty Calzone' : 'Add New Specialty Calzone'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Calzone Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full border border-gray-600 bg-slate-700 text-white rounded px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      placeholder="e.g., Traditional Calzone"
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
                      className="w-full border border-gray-600 bg-slate-700 text-white rounded px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
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
                    className="w-full border border-gray-600 bg-slate-700 text-white rounded px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    rows={3}
                    placeholder="Describe this specialty calzone..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Base Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.basePrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, basePrice: parseFloat(e.target.value) || 0 }))}
                    className="w-full border border-gray-600 bg-slate-700 text-white rounded px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="0.00"
                    required
                  />
                </div>

                {/* Ingredients Section */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Fillings
                    </label>
                    <button
                      type="button"
                      onClick={addIngredient}
                      className="text-sm bg-slate-600 hover:bg-slate-500 text-white px-2 py-1 rounded border border-gray-600"
                    >
                      Add Filling
                    </button>
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {formData.ingredients.map((ingredient, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={ingredient}
                          onChange={(e) => {
                            const newIngredients = [...formData.ingredients];
                            newIngredients[index] = e.target.value;
                            setFormData(prev => ({ ...prev, ingredients: newIngredients }));
                          }}
                          className="flex-1 border border-gray-600 bg-slate-700 text-white rounded px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                          placeholder="e.g., Ricotta cheese"
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
                            onChange={(e) => handleSizePricingChange(size.id, 'isAvailable', e.target.checked)}
                            className="bg-slate-700 border-gray-600 rounded focus:ring-amber-500"
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
                            onChange={(e) => handleSizePricingChange(size.id, 'price', parseFloat(e.target.value) || 0)}
                            className="w-full border border-gray-600 bg-slate-700 text-white rounded px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
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
                    className="mr-2 bg-slate-700 border-gray-600 rounded focus:ring-amber-500"
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-300">
                    Available for ordering
                  </label>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2 rounded hover:from-amber-600 hover:to-orange-600 transition-all duration-300"
                  >
                    {editingCalzone ? 'Update' : 'Create'}
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

        {/* Specialty Calzones List */}
        <div className="mt-8">
          {loading ? (
            <div className="text-center py-8 text-white">Loading...</div>
          ) : calzones.length === 0 ? (
            <div className="text-center py-8 text-gray-300">
              No specialty calzones found. Create your first signature calzone to get started.
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedCalzones).map(([category, categoryCalzones]) => (
                <div key={category} className="overflow-hidden shadow-xl ring-1 ring-white/20 md:rounded-lg bg-slate-800/90">
                  <div className="bg-gradient-to-r from-amber-500/30 to-orange-500/30 px-6 py-4">
                    <h3 className="text-lg font-semibold text-white">
                      {category.replace('_', ' ')} ({categoryCalzones.length})
                    </h3>
                  </div>
                  
                  <div className="bg-slate-900/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                      {categoryCalzones.map((calzone) => (
                        <div key={calzone.id} className={`border rounded-lg p-4 transition-all duration-300 hover:scale-105 ${!calzone.isActive ? 'opacity-50 bg-slate-700/60 border-slate-600' : 'bg-slate-700/80 border-slate-600 hover:bg-slate-600/80'}`}>
                          {calzone.imageUrl && (
                            <img 
                              src={calzone.imageUrl} 
                              alt={calzone.name}
                              className="w-full h-32 object-cover rounded-lg mb-4"
                            />
                          )}
                          <div className="space-y-2">
                            <div className="flex justify-between items-start">
                              <h4 className="font-semibold text-white">{calzone.name}</h4>
                              <span className={`text-sm px-2 py-1 rounded ${calzone.isActive ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
                                {calzone.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-300">{calzone.description}</p>
                            <div className="text-lg font-bold text-green-400">
                              Base: ${calzone.basePrice.toFixed(2)}
                            </div>
                            
                            {/* Size Options */}
                            {calzone.sizes && calzone.sizes.length > 0 && (
                              <div className="mt-2">
                                <div className="text-xs text-gray-400 mb-1">
                                  <strong className="text-gray-300">Size Options:</strong>
                                </div>
                                <div className="grid grid-cols-3 gap-1">
                                  {calzone.sizes.map((sizeOption) => (
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
                            
                            {calzone.ingredients && calzone.ingredients.length > 0 && (
                              <div className="text-xs text-gray-400 mt-2">
                                <strong className="text-gray-300">Fillings:</strong> {
                                  Array.isArray(calzone.ingredients) 
                                    ? calzone.ingredients.join(', ')
                                    : calzone.ingredients
                                }
                              </div>
                            )}
                            <div className="flex space-x-2 mt-4">
                              <button
                                onClick={() => handleEdit(calzone)}
                                className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 hover:border-blue-500/50 py-1 px-2 rounded text-sm transition-all duration-300"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(calzone.id)}
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
