const fs = require('fs');
const path = require('path');

try {
  const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
  const schemaContent = fs.readFileSync(schemaPath, 'utf8');
  
  // Find all model definitions
  const modelMatches = schemaContent.match(/^model\s+(\w+)\s*{/gm);
  
  if (modelMatches) {
    // Extract unique model names
    const modelNames = modelMatches.map(match => {
      const modelName = match.match(/^model\s+(\w+)/)[1];
      return modelName;
    });
    
    // Remove duplicates and sort
    const uniqueModels = [...new Set(modelNames)].sort();
    
    console.log(`📊 Total number of tables/models: ${uniqueModels.length}\n`);
    console.log('📋 Complete list of models:');
    uniqueModels.forEach((model, index) => {
      console.log(`${(index + 1).toString().padStart(2, ' ')}. ${model}`);
    });
  } else {
    console.log('No models found in schema.prisma');
  }
} catch (error) {
  console.error('Error reading schema file:', error.message);
}
