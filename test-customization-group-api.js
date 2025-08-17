const testCustomizationGroupAPI = async () => {
  try {
    const testData = {
      name: "Test API Group",
      type: "SINGLE_SELECT",
      description: "Test description",
      isRequired: false,
      minSelections: 0,
      maxSelections: null,
      sortOrder: 1,
      isActive: true,
      categoryId: null
    };

    console.log('Testing customization group API...');
    console.log('Sending data:', testData);

    const response = await fetch('http://localhost:3005/api/admin/menu/customization-groups', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    const result = await response.json();
    console.log('Response data:', result);

    if (response.ok) {
      console.log('✅ SUCCESS: Customization group created with ID:', result.id);
    } else {
      console.log('❌ ERROR:', result.error || result.message);
    }

  } catch (error) {
    console.error('❌ FETCH ERROR:', error);
  }
};

testCustomizationGroupAPI();
