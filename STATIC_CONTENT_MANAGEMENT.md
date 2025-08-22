# Static Content Management System

This system allows you to manage static page content using JSON files, providing an easy way to edit content without needing a database or complex CMS.

## Available Pages

### Core Pages
- **About Us** (`/about`) - Company story, mission, team information
- **Terms & Conditions** (`/terms`) - Service terms, ordering policies
- **Privacy Policy** (`/privacy`) - Data protection and privacy information
- **FAQ** (`/faq`) - Frequently asked questions organized by category
- **Contact** (`/contact`) - Location, hours, contact information

### Additional Pages
- **Careers** (`/careers`) - Job opportunities and company benefits (example)

## File Structure

All content files are stored in `src/data/content/` as JSON files:
```
src/data/content/
├── about-us.json
├── terms-conditions.json
├── privacy-policy.json
├── faq.json
├── contact.json
├── careers.json (example)
└── ... (add more as needed)
```

## Content Management

### Admin Interface
Access the content management interface at `/admin/content` to:
- View all content files
- Edit content in JSON format
- Preview changes on live pages
- Save updates with automatic timestamps

### Manual Editing
You can also edit the JSON files directly in your code editor. Each file follows a standard structure:

```json
{
  "page": {
    "title": "Page Title",
    "subtitle": "Optional subtitle",
    "lastUpdated": "2025-01-15"
  },
  "sections": [
    {
      "id": "section-1",
      "title": "Section Title",
      "content": ["Paragraph 1", "Paragraph 2"]
    }
  ]
}
```

## Adding New Pages

### 1. Create JSON Content File
Add a new JSON file in `src/data/content/` following the standard structure.

### 2. Create Page Route
Create a new page in `src/app/[page-name]/page.tsx`:

```tsx
import { loadContent } from '@/lib/content-loader';
import ContentPageComponent from '@/components/ContentPageComponent';

export default async function YourPage() {
  const content = await loadContent('your-file-name');
  return <ContentPageComponent content={content} pageType="generic" />;
}
```

### 3. Add Navigation Links
Update `src/components/DynamicFooter.tsx` to include links to your new page.

## Page Types

The `ContentPageComponent` supports different page types for custom rendering:
- `about` - Special formatting for team members, awards
- `terms` / `privacy` - Legal document formatting
- `faq` - Question/answer formatting with categories
- `contact` - Contact information with maps and hours
- `generic` - Standard content layout

## Benefits

✅ **No Database Required** - All content stored as version-controlled files
✅ **Easy Editing** - Simple JSON format that's human-readable
✅ **Fast Loading** - Static content loads instantly
✅ **SEO Friendly** - Server-side rendered with proper metadata
✅ **Version Control** - Content changes tracked in Git
✅ **Admin Interface** - Web-based editing for non-technical users
✅ **Flexible Structure** - Easy to extend with new content types

## Best Practices

1. **Always validate JSON** before saving
2. **Test changes** using the preview function
3. **Keep backups** of important content
4. **Use semantic section IDs** for easy reference
5. **Update lastUpdated** field when making changes
6. **Follow consistent formatting** across similar content types

## Technical Details

- **Content Loader**: `src/lib/content-loader.ts` handles file operations
- **Component**: `src/components/ContentPageComponent.tsx` renders all pages
- **API Routes**: `src/app/api/admin/content/` provides CRUD operations
- **Type Safety**: TypeScript interfaces ensure content structure consistency
