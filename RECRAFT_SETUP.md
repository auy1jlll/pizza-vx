# 🎨 Recraft MCP Server Setup for Restaurant Image Generation

This guide will help you set up the Recraft MCP server to automatically generate professional food images for your restaurant menu.

## 🚀 Quick Start

### Step 1: Get Your Recraft API Key

1. Go to [Recraft.ai](https://www.recraft.ai/)
2. Sign up for an account if you don't have one
3. Visit your [API page](https://www.recraft.ai/profile/api)
4. Purchase API credits (starts around $5 for 125 images)
5. Generate and copy your API key

### Step 2: Configure Claude Desktop

1. Open Claude Desktop
2. Go to Settings (⌘ + ,)
3. Click on "Developer" in the sidebar
4. Click "Edit Config" to open your configuration file
5. Replace the contents with the configuration from `claude-desktop-config-recraft.json`
6. Replace `YOUR_RECRAFT_API_KEY_HERE` with your actual API key
7. Save the file and restart Claude Desktop

### Step 3: Verify Setup

1. Open a new chat in Claude Desktop
2. Look for a 🔨 hammer icon in the bottom right corner
3. You should see Recraft tools available

## 🍕 Food Image Generation Examples

Once set up, you can ask Claude to generate professional food images:

### Sandwich Images
```
Generate a professional food photo of a BLT sandwich with crispy bacon, 
fresh lettuce, ripe tomatoes on toasted sourdough bread, restaurant lighting, 
appetizing presentation
```

### Pizza Images
```
Create a mouth-watering wood-fired Margherita pizza with fresh mozzarella, 
basil leaves, tomato sauce, thin crust, professional food photography, 
Italian restaurant style
```

### Dinner Plate Images
```
Generate an elegant plated grilled chicken breast with herbs and vegetables, 
professional restaurant plating, fine dining photography
```

## 🛠️ Available Recraft Tools

- **generate_image**: Create raster/vector images from text prompts
- **create_style**: Create custom styles from example images
- **vectorize_image**: Convert raster images to vectors
- **image_to_image**: Generate variations from existing images
- **remove_background**: Remove image backgrounds
- **replace_background**: Generate new backgrounds
- **crisp_upscale**: Enhance image resolution
- **creative_upscale**: AI-enhanced upscaling

## 💰 Pricing

- Raster images: $0.04 each
- Vector images: $0.08 each
- Background removal: $0.01 each
- Vectorization: $0.01 each
- Crisp upscale: $0.004 each
- Creative upscale: $0.25 each

## 📁 File Structure

```
restoApp/
├── generated-images/          # Where Recraft saves images
├── claude-desktop-config-recraft.json  # Configuration template
├── recraft-integration-plan.js # Integration examples
└── test-recraft-setup.js     # Setup verification
```

## 🎯 Integration with Your Restaurant App

### Current Workflow
1. Generate images using Recraft through Claude
2. Images are saved to `generated-images/` folder
3. Copy images to `public/images/menu/`
4. Update database with new image URLs
5. Replace Unsplash images with custom generated ones

### Example Integration
```javascript
// Update menu item with generated image
const updateMenuItemImage = async (itemName, generatedImagePath) => {
  const publicPath = `/images/menu/${itemName.toLowerCase().replace(/\s+/g, '-')}.jpg`;
  
  await prisma.menuItem.updateMany({
    where: { name: itemName },
    data: { imageUrl: publicPath }
  });
};
```

## 🔧 Troubleshooting

### Server not showing up in Claude
- Restart Claude Desktop after configuration
- Check that the API key is correct
- Verify the configuration file syntax

### Images not generating
- Check API credits balance
- Verify internet connection
- Review prompt clarity and specificity

### Tools not visible
- Look for the 🔨 hammer icon in Claude
- Check the Developer console for errors
- Ensure MCP server is properly configured

## 📊 Menu Items Ready for Generation

The following items have been prepared with professional food photography prompts:

**Deli Subs:**
- BLT Sub
- Turkey Club  
- Italian Sub
- Roast Beef Sub

**Specialty Pizzas:**
- Margherita Pizza
- Pepperoni Pizza
- Supreme Pizza

**Dinner Plates:**
- Grilled Chicken Breast
- Pasta Carbonara
- Caesar Salad

## 🌟 Benefits of Recraft for Restaurant Images

- **Consistent Brand Styling**: All images match your restaurant's aesthetic
- **High Quality**: Professional food photography appearance
- **Customizable**: Adjust lighting, angles, and presentation
- **Cost Effective**: Cheaper than hiring a food photographer
- **Scalable**: Generate images for new menu items instantly
- **Multiple Formats**: Raster and vector options available

## 📞 Support

- [Recraft Documentation](https://recraft.ai/docs)
- [Recraft API Reference](https://recraft.ai/docs/api)
- [Model Context Protocol](https://modelcontextprotocol.io/)

---

Ready to create amazing food images for your restaurant? Follow the steps above and start generating professional menu photos! 🚀
