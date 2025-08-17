// Dynamic metadata generation using app settings
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';

async function getAppSettings() {
  try {
    // Direct database query instead of API call to avoid server-side fetch issues
    const settings = await prisma.appSetting.findMany({
      orderBy: { key: 'asc' }
    });

    // Convert to key-value object
    const settingsObject: Record<string, any> = settings.reduce((acc: Record<string, any>, setting) => {
      let value: any = setting.value;
      
      // Parse values based on type
      switch (setting.type) {
        case 'NUMBER':
          value = parseFloat(setting.value);
          break;
        case 'BOOLEAN':
          value = setting.value === 'true';
          break;
        case 'JSON':
          try {
            value = JSON.parse(setting.value);
          } catch {
            value = setting.value;
          }
          break;
        default:
          value = setting.value;
      }
      
      acc[setting.key] = value;
      return acc;
    }, {});

    return settingsObject;
  } catch (error) {
    console.error('Error fetching settings for metadata:', error);
    // Return default values
    return {
      app_name: 'Pizza Builder Pro',
      meta_title: 'Pizza Builder Pro - Custom Pizza Builder',
      meta_description: 'Build your perfect pizza with our interactive pizza builder. Choose from fresh ingredients and watch your creation come to life!',
      meta_keywords: 'pizza, custom pizza, pizza builder, online ordering, fresh ingredients'
    };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getAppSettings();
  
  return {
    title: settings.meta_title || settings.app_name || 'Pizza Builder Pro',
    description: settings.meta_description || 'Build your perfect pizza with our interactive pizza builder',
    keywords: settings.meta_keywords || 'pizza, custom pizza, pizza builder',
    openGraph: {
      title: settings.meta_title || settings.app_name,
      description: settings.meta_description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: settings.meta_title || settings.app_name,
      description: settings.meta_description,
    },
  };
}
