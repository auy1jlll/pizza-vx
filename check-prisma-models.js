const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

console.log('Customization-related models:');
const customizationModels = Object.keys(prisma).filter(k => k.includes('customization'));
console.log(customizationModels.join(', '));

prisma.$disconnect();
