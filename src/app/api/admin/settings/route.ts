import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { adminLimiter } from '@/lib/simple-rate-limit';

// Get all settings
export async function GET(request: NextRequest) {
  try {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || 'local';
  const limit = adminLimiter.check('admin-settings-get', ip);
  if (!limit.allowed) return NextResponse.json({ error: 'Too many admin requests. Please slow down.' }, { status: 429 });
    const settings = await prisma.appSetting.findMany({
      orderBy: { key: 'asc' }
    });

    // Convert to key-value object for easier frontend consumption
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

    return NextResponse.json({ settings: settingsObject });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// Update multiple settings
export async function PUT(request: NextRequest) {
  try {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || 'local';
  const limit = adminLimiter.check('admin-settings-put', ip);
  if (!limit.allowed) return NextResponse.json({ error: 'Too many admin requests. Please slow down.' }, { status: 429 });
    const { settings } = await request.json();

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json(
        { error: 'Invalid settings data' },
        { status: 400 }
      );
    }

    // Update each setting
    const updatePromises = Object.entries(settings).map(async ([key, value]) => {
      let stringValue = String(value);
      let type = 'STRING';

      // Determine type
      if (typeof value === 'number') {
        type = 'NUMBER';
      } else if (typeof value === 'boolean') {
        type = 'BOOLEAN';
      } else if (typeof value === 'object') {
        type = 'JSON';
        stringValue = JSON.stringify(value);
      }

      return prisma.appSetting.upsert({
        where: { key },
        update: {
          value: stringValue,
          type: type as any,
          updatedAt: new Date()
        },
        create: {
          key,
          value: stringValue,
          type: type as any
        }
      });
    });

    await Promise.all(updatePromises);

    return NextResponse.json({ 
      message: 'Settings updated successfully' 
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
