import QRCode from 'qrcode';

export interface QRCodeOptions {
  width?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
}

export async function generateQRCode(
  data: string,
  options: QRCodeOptions = {}
): Promise<string> {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(data, {
      width: options.width || 256,
      margin: options.margin || 2,
      color: {
        dark: options.color?.dark || '#000000',
        light: options.color?.light || '#FFFFFF',
      },
    });
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
}

export function generateTableURL(tableNumber: number, baseURL?: string): string {
  const domain = baseURL || window.location.origin;
  return `${domain}?table=${tableNumber}`;
}

export function extractTableNumberFromURL(): number | null {
  if (typeof window === 'undefined') return null;

  const urlParams = new URLSearchParams(window.location.search);
  const tableParam = urlParams.get('table');

  if (tableParam) {
    const tableNumber = parseInt(tableParam, 10);
    return isNaN(tableNumber) ? null : tableNumber;
  }

  return null;
}