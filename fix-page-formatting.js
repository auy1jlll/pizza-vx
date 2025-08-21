const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updatePageFormatting() {
  console.log('🎨 Updating page formatting for better readability and SEO...\n');
  
  try {
    // Get all published pages
    const pages = await prisma.dynamicPage.findMany({
      where: { status: 'PUBLISHED' }
    });

    console.log(`Found ${pages.length} pages to update formatting\n`);

    for (const page of pages) {
      console.log(`Updating: ${page.title}`);
      
      // Convert content to proper HTML with spacing and formatting
      let formattedContent = page.content;
      
      // Fix markdown headings with proper spacing
      formattedContent = formattedContent
        .replace(/^### (.*$)/gim, '\n\n### $1\n\n')
        .replace(/^## (.*$)/gim, '\n\n## $1\n\n')
        .replace(/^# (.*$)/gim, '# $1\n\n')
        
        // Add spacing around lists
        .replace(/^- /gim, '\n- ')
        .replace(/^(\d+\.) /gim, '\n$1 ')
        
        // Add spacing around paragraphs
        .replace(/\n\n\n+/g, '\n\n')
        .replace(/([.!?])\n([A-Z])/g, '$1\n\n$2')
        
        // Ensure proper spacing around sections
        .replace(/(\*\*[^*]+\*\*)/g, '\n\n$1\n\n')
        .replace(/(\*[^*]+\*:)/g, '\n\n$1 ')
        
        // Clean up multiple newlines
        .replace(/\n{3,}/g, '\n\n')
        .trim();

      await prisma.dynamicPage.update({
        where: { id: page.id },
        data: { content: formattedContent }
      });
      
      console.log(`✅ Updated: ${page.slug}`);
    }
    
    console.log('\n🎉 All pages updated with proper formatting!');
    console.log('\n📊 Formatting improvements:');
    console.log('✓ Proper heading spacing');
    console.log('✓ Paragraph breaks');
    console.log('✓ List formatting');
    console.log('✓ Section separators');
    console.log('✓ SEO-friendly structure');
    
  } catch (error) {
    console.error('❌ Error updating pages:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

updatePageFormatting();
