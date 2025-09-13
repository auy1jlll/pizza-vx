'use client';

import { useState } from 'react';
import { generateQRCode, generateTableURL } from '@/lib/qrCode';
import { menuItems } from '@/data/menu';
import { QrCode, Download, Settings, BarChart3 } from 'lucide-react';

export default function AdminPage() {
  const [selectedTable, setSelectedTable] = useState(1);
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateTableQR = async () => {
    setIsGenerating(true);
    try {
      const tableURL = generateTableURL(selectedTable);
      const qrCode = await generateQRCode(tableURL, {
        width: 300,
        color: {
          dark: '#dc2626',
          light: '#ffffff',
        },
      });
      setQrCodeDataURL(qrCode);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeDataURL) return;

    const link = document.createElement('a');
    link.download = `table-${selectedTable}-qr-code.png`;
    link.href = qrCodeDataURL;
    link.click();
  };

  const downloadAllQRCodes = async () => {
    // Generate QR codes for tables 1-20
    for (let table = 1; table <= 20; table++) {
      const tableURL = generateTableURL(table);
      const qrCode = await generateQRCode(tableURL, {
        width: 300,
        color: { dark: '#dc2626', light: '#ffffff' },
      });

      const link = document.createElement('a');
      link.download = `table-${table}-qr-code.png`;
      link.href = qrCode;
      link.click();

      // Small delay to prevent browser blocking downloads
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  };

  // Mock order data for demo
  const mockOrders = [
    {
      id: '12345',
      table: 5,
      customer: 'John Doe',
      items: ['Margherita Pizza', 'Garlic Bread'],
      total: 24.98,
      status: 'preparing',
      time: '5 mins ago',
    },
    {
      id: '12346',
      table: 2,
      customer: 'Jane Smith',
      items: ['Pepperoni Pizza', 'Coke'],
      total: 19.98,
      status: 'ready',
      time: '12 mins ago',
    },
    {
      id: '12347',
      table: null,
      customer: 'Mike Johnson',
      items: ['Supreme Pizza', 'Wings'],
      total: 31.98,
      status: 'completed',
      time: '25 mins ago',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparing': return 'bg-yellow-100 text-yellow-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Pizza Palace Admin</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* QR Code Generator */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-2 mb-4">
              <QrCode className="w-6 h-6 text-red-600" />
              <h2 className="text-xl font-semibold">QR Code Generator</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Table Number
                </label>
                <div className="flex space-x-3">
                  <input
                    type="number"
                    value={selectedTable}
                    onChange={(e) => setSelectedTable(parseInt(e.target.value) || 1)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    min="1"
                    max="99"
                  />
                  <button
                    onClick={generateTableQR}
                    disabled={isGenerating}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {isGenerating ? 'Generating...' : 'Generate'}
                  </button>
                </div>
              </div>

              {qrCodeDataURL && (
                <div className="text-center">
                  <div className="bg-white p-4 rounded-lg border inline-block">
                    <img src={qrCodeDataURL} alt={`QR Code for Table ${selectedTable}`} />
                    <p className="text-sm text-gray-600 mt-2">Table {selectedTable}</p>
                  </div>
                  <div className="mt-4 space-x-3">
                    <button
                      onClick={downloadQRCode}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <button
                  onClick={downloadAllQRCodes}
                  className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Download All QR Codes (Tables 1-20)
                </button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Downloads individual QR code files for all tables
                </p>
              </div>
            </div>
          </div>

          {/* Live Orders */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-2 mb-4">
              <BarChart3 className="w-6 h-6 text-red-600" />
              <h2 className="text-xl font-semibold">Live Orders</h2>
            </div>

            <div className="space-y-3">
              {mockOrders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">Order #{order.id}</p>
                      <p className="text-sm text-gray-600">
                        {order.customer} {order.table && `• Table ${order.table}`}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600 mb-2">
                    {order.items.join(', ')}
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-semibold">${order.total.toFixed(2)}</span>
                    <span className="text-xs text-gray-500">{order.time}</span>
                  </div>

                  {order.status === 'preparing' && (
                    <button className="w-full mt-2 bg-green-600 text-white py-1 px-3 rounded text-sm hover:bg-green-700 transition-colors">
                      Mark Ready
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Settings className="w-6 h-6 text-red-600" />
              <h2 className="text-xl font-semibold">Today's Summary</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">47</p>
                <p className="text-sm text-gray-600">Total Orders</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">$1,247</p>
                <p className="text-sm text-gray-600">Revenue</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">3</p>
                <p className="text-sm text-gray-600">Active Orders</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">18m</p>
                <p className="text-sm text-gray-600">Avg Prep Time</p>
              </div>
            </div>
          </div>

          {/* Menu Management Preview */}
          <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Menu Items</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Item</th>
                    <th className="text-left py-2">Category</th>
                    <th className="text-left py-2">Price</th>
                    <th className="text-left py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {menuItems.slice(0, 6).map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-2">{item.name}</td>
                      <td className="py-2 capitalize">{item.category}</td>
                      <td className="py-2">${item.basePrice.toFixed(2)}</td>
                      <td className="py-2">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          Available
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}