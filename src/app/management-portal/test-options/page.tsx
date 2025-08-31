'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';

interface CustomizationGroup {
  id: string;
  name: string;
  type: string;
}

export default function TestOptionsPage() {
  const [groups, setGroups] = useState<CustomizationGroup[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await fetch('/api/management-portal/menu/customization-groups');
      if (response.ok) {
        const data = await response.json();
        const groupsData = Array.isArray(data) ? data : data.groups || [];
        setGroups(groupsData);
        if (groupsData.length > 0) {
          setSelectedGroupId(groupsData[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
      addResult('❌ Error fetching groups: ' + error.message);
    }
  };

  const addResult = (message: string) => {
    setResults(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const clearResults = () => {
    setResults([]);
  };

  const testCreateOption = async (optionData: any, testName: string) => {
    addResult(`🧪 Testing: ${testName}`);
    addResult(`📤 Payload: ${JSON.stringify(optionData, null, 2)}`);

    try {
      const response = await fetch('/api/management-portal/menu/customization-options', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(optionData),
      });

      const result = await response.json();
      
      addResult(`📥 Status: ${response.status}`);
      addResult(`📥 Response: ${JSON.stringify(result, null, 2)}`);

      if (response.ok && result.success) {
        addResult(`✅ SUCCESS: ${testName}`);
        return result.data;
      } else {
        addResult(`❌ FAILED: ${testName} - ${result.error || 'Unknown error'}`);
        if (result.details) {
          addResult(`   Details: ${result.details.join(', ')}`);
        }
        return null;
      }
    } catch (error) {
      addResult(`❌ NETWORK ERROR: ${error.message}`);
      return null;
    }
  };

  const runCalzoneTests = async () => {
    if (!selectedGroupId) {
      addResult('❌ Please select a customization group first');
      return;
    }

    setLoading(true);
    clearResults();

    addResult('🍕 Starting Calzone Options Tests');
    addResult('='.repeat(40));

    // Test 1: Small Calzone (basic case)
    const smallCalzone = await testCreateOption({
      groupId: selectedGroupId,
      name: 'Small Calzone',
      description: 'Regular size calzone',
      priceModifier: 0,
      priceType: 'FLAT',
      isDefault: true,
      isActive: true,
      sortOrder: 1
    }, 'Small Calzone (0 price)');

    // Test 2: Large Calzone (positive price)
    const largeCalzone = await testCreateOption({
      groupId: selectedGroupId,
      name: 'Large Calzone',
      description: 'Extra large calzone',
      priceModifier: 3.0,
      priceType: 'FLAT',
      isDefault: false,
      isActive: true,
      sortOrder: 2
    }, 'Large Calzone (+$3.00)');

    // Test 3: Discounted option (negative price)
    const discountCalzone = await testCreateOption({
      groupId: selectedGroupId,
      name: 'Student Discount Calzone',
      description: 'Discounted calzone for students',
      priceModifier: -2.0,
      priceType: 'FLAT',
      isDefault: false,
      isActive: true,
      sortOrder: 3
    }, 'Discount Calzone (-$2.00)');

    // Test 4: Percentage-based option
    const percentageOption = await testCreateOption({
      groupId: selectedGroupId,
      name: 'Premium Calzone',
      description: '20% upcharge for premium ingredients',
      priceModifier: 20,
      priceType: 'PERCENTAGE',
      isDefault: false,
      isActive: true,
      sortOrder: 4
    }, 'Premium Calzone (20% upcharge)');

    addResult('='.repeat(40));
    addResult('🎯 Test Summary Complete');

    setLoading(false);
  };

  const quickCreateCalzoneGroup = async () => {
    setLoading(true);
    addResult('📝 Creating Calzone Size customization group...');

    try {
      const groupData = {
        name: 'Calzone Size',
        description: 'Choose your calzone size',
        type: 'SINGLE_SELECT',
        isRequired: true,
        minSelections: 1,
        maxSelections: 1,
        sortOrder: 1,
        isActive: true
      };

      const response = await fetch('/api/management-portal/menu/customization-groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(groupData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        addResult('✅ Created Calzone Size group successfully');
        setSelectedGroupId(result.data.id);
        await fetchGroups(); // Refresh the groups list
      } else {
        addResult('❌ Failed to create group: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      addResult('❌ Error creating group: ' + error.message);
    }

    setLoading(false);
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-xl">
          <h1 className="text-2xl font-bold">🧪 Customization Options Test Lab</h1>
          <p className="mt-2 opacity-90">
            This page bypasses the form validation and tests the API directly.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Test Configuration</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Customization Group:
              </label>
              <div className="flex gap-2">
                <select
                  value={selectedGroupId}
                  onChange={(e) => setSelectedGroupId(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select a group...</option>
                  {groups.map(group => (
                    <option key={group.id} value={group.id}>
                      {group.name} ({group.type})
                    </option>
                  ))}
                </select>
                <button
                  onClick={quickCreateCalzoneGroup}
                  disabled={loading}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                >
                  Create Calzone Group
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={runCalzoneTests}
                disabled={loading || !selectedGroupId}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 font-semibold"
              >
                🍕 Run Calzone Tests
              </button>
              
              <button
                onClick={clearResults}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Clear Results
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 text-green-400 rounded-xl p-6 font-mono text-sm">
          <h3 className="text-white font-semibold mb-4">Test Results Console:</h3>
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {results.length === 0 ? (
              <div className="text-gray-500">No tests run yet. Click "Run Calzone Tests" to start.</div>
            ) : (
              results.map((result, index) => (
                <div key={index} className="whitespace-pre-wrap">
                  {result}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <h4 className="font-semibold text-yellow-800 mb-2">💡 What This Tests:</h4>
          <ul className="text-yellow-700 text-sm space-y-1">
            <li>• Direct API calls bypassing form validation</li>
            <li>• Positive, zero, and negative price modifiers</li>
            <li>• Different price types (FLAT, PERCENTAGE)</li>
            <li>• Required field validation</li>
            <li>• Data type validation</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}
