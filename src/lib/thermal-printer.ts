// Thermal Printer Utility for Epson ESC/POS Commands
export interface PrinterOrder {
  orderNumber: string;
  customerName?: string;
  customerPhone?: string;
  orderType: string;
  deliveryAddress?: string;
  deliveryCity?: string;
  deliveryZip?: string;
  deliveryInstructions?: string;
  status: string;
  createdAt: string;
  orderItems: Array<{
    id: string;
    quantity: number;
    totalPrice: number;
    notes?: string;
    pizzaSize?: { name: string; diameter: string } | null;
    pizzaCrust?: { name: string } | null;
    pizzaSauce?: { name: string } | null;
    menuItem?: { name: string; category: string } | null;
    toppings: Array<{
      quantity: number;
      price: number;
      pizzaTopping: { name: string };
    }>;
    customizations: Array<{
      name: string;
      value: string;
      price: number;
    }>;
  }>;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  notes?: string;
}

export class ThermalPrinter {
  // ESC/POS Commands
  private static readonly ESC = '\x1B';
  private static readonly GS = '\x1D';
  
  // Text formatting commands
  private static readonly INIT = '\x1B\x40'; // Initialize printer
  private static readonly BOLD_ON = '\x1B\x45\x01'; // Bold on
  private static readonly BOLD_OFF = '\x1B\x45\x00'; // Bold off
  private static readonly CENTER = '\x1B\x61\x01'; // Center align
  private static readonly LEFT = '\x1B\x61\x00'; // Left align
  private static readonly RIGHT = '\x1B\x61\x02'; // Right align
  private static readonly DOUBLE_HEIGHT = '\x1B\x21\x10'; // Double height
  private static readonly NORMAL_SIZE = '\x1B\x21\x00'; // Normal size
  private static readonly CUT_PAPER = '\x1D\x56\x42\x00'; // Cut paper
  private static readonly LINE_FEED = '\n';
  private static readonly DOUBLE_LINE_FEED = '\n\n';

  // Format currency
  private static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }

  // Format date/time
  private static formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  // Create a separator line
  private static createSeparator(char: string = '-', length: number = 32): string {
    return char.repeat(length) + this.LINE_FEED;
  }

  // Pad text to fit thermal printer width (32 characters)
  private static padLine(left: string, right: string, width: number = 32): string {
    const totalPadding = width - left.length - right.length;
    const padding = totalPadding > 0 ? ' '.repeat(totalPadding) : ' ';
    return left + padding + right + this.LINE_FEED;
  }

  // Get item display name
  private static getItemDisplayName(item: PrinterOrder['orderItems'][0]): string {
    if (item.menuItem) {
      return item.menuItem.name;
    }
    if (item.pizzaSize && item.pizzaCrust) {
      return `${item.pizzaSize.name} ${item.pizzaCrust.name} Pizza`;
    }
    return 'Custom Item';
  }

  // Generate receipt text for thermal printer
  public static generateReceipt(order: PrinterOrder): string {
    let receipt = '';

    // Initialize printer
    receipt += this.INIT;

    // Header
    receipt += this.CENTER + this.BOLD_ON + this.DOUBLE_HEIGHT;
    receipt += 'PIZZA RESTAURANT' + this.LINE_FEED;
    receipt += this.NORMAL_SIZE + this.BOLD_OFF;
    receipt += 'Fresh • Fast • Delicious' + this.LINE_FEED;
    receipt += this.LEFT;
    receipt += this.createSeparator('=');

    // Order Info
    receipt += this.BOLD_ON + `ORDER #${order.orderNumber}` + this.BOLD_OFF + this.LINE_FEED;
    receipt += `Date: ${this.formatDateTime(order.createdAt)}` + this.LINE_FEED;
    receipt += `Type: ${order.orderType}` + this.LINE_FEED;
    receipt += `Status: ${order.status}` + this.LINE_FEED;
    receipt += this.createSeparator();

    // Customer Info
    if (order.customerName) {
      receipt += this.BOLD_ON + 'CUSTOMER:' + this.BOLD_OFF + this.LINE_FEED;
      receipt += `Name: ${order.customerName}` + this.LINE_FEED;
      if (order.customerPhone) {
        receipt += `Phone: ${order.customerPhone}` + this.LINE_FEED;
      }
      
      // Delivery Info
      if (order.orderType === 'DELIVERY' && order.deliveryAddress) {
        receipt += this.LINE_FEED + this.BOLD_ON + 'DELIVERY:' + this.BOLD_OFF + this.LINE_FEED;
        receipt += `${order.deliveryAddress}` + this.LINE_FEED;
        receipt += `${order.deliveryCity}, ${order.deliveryZip}` + this.LINE_FEED;
        if (order.deliveryInstructions) {
          receipt += `Notes: ${order.deliveryInstructions}` + this.LINE_FEED;
        }
      }
      receipt += this.createSeparator();
    }

    // Order Items
    receipt += this.BOLD_ON + 'ITEMS:' + this.BOLD_OFF + this.LINE_FEED;
    
    order.orderItems.forEach((item, index) => {
      const itemName = this.getItemDisplayName(item);
      const itemTotal = this.formatCurrency(item.totalPrice);
      
      // Item header
      receipt += `${item.quantity}x ${itemName}` + this.LINE_FEED;
      receipt += this.padLine('', itemTotal);

      // Pizza details
      if (item.pizzaSize) {
        receipt += `  Size: ${item.pizzaSize.name} (${item.pizzaSize.diameter})` + this.LINE_FEED;
        if (item.pizzaCrust) {
          receipt += `  Crust: ${item.pizzaCrust.name}` + this.LINE_FEED;
        }
        if (item.pizzaSauce) {
          receipt += `  Sauce: ${item.pizzaSauce.name}` + this.LINE_FEED;
        }
      }

      // Toppings
      if (item.toppings && item.toppings.length > 0) {
        receipt += '  Toppings:' + this.LINE_FEED;
        item.toppings.forEach(topping => {
          const toppingPrice = topping.price > 0 ? ` (+${this.formatCurrency(topping.price)})` : '';
          receipt += `    ${topping.pizzaTopping.name} x${topping.quantity}${toppingPrice}` + this.LINE_FEED;
        });
      }

      // Customizations
      if (item.customizations && item.customizations.length > 0) {
        receipt += '  Customizations:' + this.LINE_FEED;
        item.customizations.forEach(custom => {
          const customPrice = custom.price > 0 ? ` (+${this.formatCurrency(custom.price)})` : '';
          receipt += `    ${custom.name}: ${custom.value}${customPrice}` + this.LINE_FEED;
        });
      }

      // Item notes
      if (item.notes) {
        receipt += `  Notes: ${item.notes}` + this.LINE_FEED;
      }

      receipt += this.LINE_FEED;
    });

    receipt += this.createSeparator();

    // Totals
    receipt += this.padLine('Subtotal:', this.formatCurrency(order.subtotal));
    
    if (order.deliveryFee > 0) {
      receipt += this.padLine('Delivery:', this.formatCurrency(order.deliveryFee));
    }
    
    receipt += this.padLine('Tax:', this.formatCurrency(order.tax));
    receipt += this.createSeparator();
    receipt += this.BOLD_ON;
    receipt += this.padLine('TOTAL:', this.formatCurrency(order.total));
    receipt += this.BOLD_OFF;

    // Order notes
    if (order.notes) {
      receipt += this.LINE_FEED + this.BOLD_ON + 'ORDER NOTES:' + this.BOLD_OFF + this.LINE_FEED;
      receipt += order.notes + this.LINE_FEED;
    }

    // Footer
    receipt += this.DOUBLE_LINE_FEED;
    receipt += this.CENTER;
    receipt += 'Thank you for your order!' + this.LINE_FEED;
    receipt += 'Please come again!' + this.DOUBLE_LINE_FEED;
    receipt += this.LEFT;

    // Cut paper
    receipt += this.CUT_PAPER;

    return receipt;
  }

  // Print to thermal printer (browser-based)
  public static async printReceipt(order: PrinterOrder): Promise<void> {
    try {
      // Generate receipt text
      const receiptText = this.generateReceipt(order);

      // Method 1: Try to use Web Serial API (Chrome 89+)
      if ('serial' in navigator) {
        try {
          // Request serial port
          const port = await (navigator as any).serial.requestPort();
          await port.open({ baudRate: 9600 });

          // Send data to printer
          const writer = port.writable.getWriter();
          const encoder = new TextEncoder();
          await writer.write(encoder.encode(receiptText));
          await writer.releaseLock();
          await port.close();

          return;
        } catch (serialError) {
          console.warn('Serial API failed, falling back to alternative method:', serialError);
        }
      }

      // Method 2: Fallback - Open print dialog with formatted text
      const printWindow = window.open('', '_blank', 'width=400,height=600');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Order #${order.orderNumber}</title>
              <style>
                body {
                  font-family: 'Courier New', monospace;
                  font-size: 12px;
                  line-height: 1.2;
                  margin: 10px;
                  white-space: pre-wrap;
                }
                @media print {
                  body { margin: 0; }
                  @page { margin: 0; size: 80mm auto; }
                }
              </style>
            </head>
            <body>${receiptText.replace(/\n/g, '<br>')}</body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
        printWindow.close();
      }
    } catch (error) {
      console.error('Failed to print receipt:', error);
      throw new Error('Failed to print receipt. Please check printer connection.');
    }
  }

  // Download receipt as text file (fallback option)
  public static downloadReceipt(order: PrinterOrder): void {
    const receiptText = this.generateReceipt(order);
    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `order-${order.orderNumber}-receipt.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }
}
