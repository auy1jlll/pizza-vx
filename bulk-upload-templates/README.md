# Bulk Upload Templates for Restaurant Menu System

## Overview
This system uses CSV templates to manage menu data in a structured, professional way. This approach ensures data consistency, maintains relationships, and allows for easy updates.

## Upload Order (IMPORTANT!)
Files must be uploaded in this exact order to maintain database relationships:

1. **1-categories.csv** - Creates menu categories first
2. **2-menu-items.csv** - Creates items within categories  
3. **3-customization-groups.csv** - Creates customization groups for items
4. **4-customization-options.csv** - Creates individual options within groups

## File Descriptions

### 1-categories.csv
- **Purpose**: Define menu categories (Deli Subs, Dinner Plates, etc.)
- **Key Fields**: name, slug, description, image_url, display_order
- **Note**: slugs must be unique and URL-friendly

### 2-menu-items.csv  
- **Purpose**: Define individual menu items
- **Key Fields**: category_slug (links to categories), name, description, base_price
- **Note**: category_slug must match existing category slug

### 3-customization-groups.csv
- **Purpose**: Define customization categories for each item
- **Key Fields**: menu_item_name, group_name, group_type (single/multiple)
- **Examples**: "Bread Choice" (single), "Add-ons" (multiple)

### 4-customization-options.csv
- **Purpose**: Define individual options within customization groups
- **Key Fields**: menu_item_name, group_name, option_name, price_modifier
- **Note**: price_modifier can be positive (upcharge) or negative (discount)

## Data Management Workflow

### Who Updates the Data?

**Option 1: Restaurant Staff (Recommended)**
- Restaurant manager/owner maintains Excel/Google Sheets
- Updates prices, adds new items, modifies descriptions
- Exports to CSV when ready to update system
- **Pros**: Direct control, real-time knowledge of menu changes
- **Cons**: Requires basic spreadsheet skills

**Option 2: Automated Scraping**
- System could scrape competitor websites for pricing data
- AI could generate descriptions and categorize items
- **Pros**: Fully automated
- **Cons**: Legal issues, data accuracy concerns, lacks local knowledge

**Option 3: Hybrid Approach**
- Base template populated by staff
- AI assists with descriptions and categorization
- Automated price comparison for market research
- **Pros**: Best of both worlds
- **Cons**: More complex to implement

### Recommended Process:

1. **Initial Setup**: Use these templates as starting point
2. **Staff Training**: Train 1-2 staff members on spreadsheet management
3. **Regular Updates**: Weekly/monthly CSV exports and uploads
4. **Quality Control**: Review all changes before upload
5. **Backup**: Keep historical versions of CSV files

## Data Validation Rules

### Categories
- Slug must be lowercase, hyphenated (kebab-case)
- Display order must be unique integers
- Image URLs should be relative paths

### Menu Items  
- Category slug must exist in categories table
- Base price must be positive decimal (xx.xx format)
- Names should be consistent for customization linking

### Customizations
- Menu item name must exactly match item in menu-items.csv
- Group types: "single" (radio buttons) or "multiple" (checkboxes)
- Price modifiers: use 0.00 for no charge, positive for upcharge

## Best Practices

### Data Entry
- Use consistent naming (exact spelling matters)
- Include units in descriptions ("6 inch", "12 inch")
- Set realistic price modifiers
- Mark one option as default (is_default=true) for single-select groups

### Quality Control
- Validate all relationships before upload
- Test with small batches first
- Keep backup copies of working CSV files
- Document any custom business rules

### Maintenance
- Regular price updates (monthly/quarterly)
- Seasonal menu additions/removals  
- Monitor for orphaned customizations
- Archive old menu versions

## Technical Notes

### CSV Format Requirements
- UTF-8 encoding
- Comma delimited
- Headers in first row
- Quotes around text fields with commas
- Boolean values: true/false (lowercase)
- Decimal format: xx.xx (2 decimal places)

### Common Issues
- **Relationship Errors**: Menu item name in customizations doesn't match menu items
- **Encoding Problems**: Special characters not displaying correctly
- **Price Format**: Using $ symbols or commas in price fields
- **Boolean Values**: Using 1/0 instead of true/false

## Future Enhancements

### Planned Features
- Web-based CSV editor interface
- Real-time validation during upload
- Automated backup and versioning
- Integration with POS systems
- Nutritional information fields
- Multi-language support

### AI Integration Ideas
- Auto-generate descriptions from ingredients
- Suggest pricing based on cost analysis
- Optimize menu layout for profitability
- Generate seasonal menu variations

---

**Last Updated**: August 2025  
**Version**: 1.0  
**Contact**: Restaurant Management System Team
