import { promises as fs } from 'fs';
import path from 'path';

export interface ContentPage {
  page: {
    title: string;
    subtitle?: string;
    heroImage?: string;
    lastUpdated: string;
    effectiveDate?: string;
  };
  [key: string]: any;
}

const CONTENT_DIR = path.join(process.cwd(), 'src', 'data', 'content');

/**
 * Load content from a JSON file
 */
export async function loadContent(filename: string): Promise<ContentPage> {
  try {
    const filePath = path.join(CONTENT_DIR, `${filename}.json`);
    const content = await fs.readFile(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error loading content file ${filename}:`, error);
    throw new Error(`Failed to load content: ${filename}`);
  }
}

/**
 * Get all available content files
 */
export async function getAvailableContent(): Promise<string[]> {
  try {
    const files = await fs.readdir(CONTENT_DIR);
    return files
      .filter(file => file.endsWith('.json'))
      .map(file => file.replace('.json', ''));
  } catch (error) {
    console.error('Error reading content directory:', error);
    return [];
  }
}

/**
 * Save content to a JSON file (for future admin editing)
 */
export async function saveContent(filename: string, content: ContentPage): Promise<void> {
  try {
    const filePath = path.join(CONTENT_DIR, `${filename}.json`);
    const jsonContent = JSON.stringify(content, null, 2);
    await fs.writeFile(filePath, jsonContent, 'utf8');
  } catch (error) {
    console.error(`Error saving content file ${filename}:`, error);
    throw new Error(`Failed to save content: ${filename}`);
  }
}

/**
 * Validate content structure
 */
export function validateContent(content: any): content is ContentPage {
  return (
    content &&
    typeof content === 'object' &&
    content.page &&
    typeof content.page.title === 'string' &&
    typeof content.page.lastUpdated === 'string'
  );
}
