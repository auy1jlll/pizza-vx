'use client';

import { useState, useEffect } from 'react';
import { QrCode, X, Hash } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { extractTableNumberFromURL } from '@/lib/qrCode';

interface QRScannerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QRScanner({ isOpen, onClose }: QRScannerProps) {
  const [manualTableNumber, setManualTableNumber] = useState('');
  const { setTableNumber, tableNumber } = useCartStore();

  useEffect(() => {
    // Check for table number in URL on component mount
    const urlTableNumber = extractTableNumberFromURL();
    if (urlTableNumber) {
      setTableNumber(urlTableNumber);
    }
  }, [setTableNumber]);

  const handleManualEntry = () => {
    const num = parseInt(manualTableNumber, 10);
    if (!isNaN(num) && num > 0) {
      setTableNumber(num);
      setManualTableNumber('');
      onClose();
    }
  };

  const handleScanQR = async () => {
    // In a real app, this would open camera for QR scanning
    // For demo, we'll simulate a scan
    const simulatedTableNumber = Math.floor(Math.random() * 20) + 1;
    setTableNumber(simulatedTableNumber);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Set Table Number</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {tableNumber && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <p className="text-green-800 font-medium">
              Current Table: {tableNumber}
            </p>
          </div>
        )}

        {/* QR Code Scanner */}
        <div className="mb-6">
          <button
            onClick={handleScanQR}
            className="w-full bg-red-600 text-white py-4 px-6 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-3"
          >
            <QrCode className="w-6 h-6" />
            <span>Scan QR Code</span>
          </button>
          <p className="text-xs text-gray-500 text-center mt-2">
            (Demo: Simulates QR scan)
          </p>
        </div>

        {/* Manual Entry */}
        <div className="border-t pt-4">
          <p className="text-sm text-gray-600 mb-3">Or enter table number manually:</p>
          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <Hash className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={manualTableNumber}
                onChange={(e) => setManualTableNumber(e.target.value)}
                placeholder="Table number"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                min="1"
                max="99"
              />
            </div>
            <button
              onClick={handleManualEntry}
              disabled={!manualTableNumber}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Set
            </button>
          </div>
        </div>

        {/* Clear Table */}
        {tableNumber && (
          <button
            onClick={() => {
              setTableNumber(null);
              onClose();
            }}
            className="w-full mt-4 text-red-600 hover:text-red-700 py-2"
          >
            Clear Table Number
          </button>
        )}
      </div>
    </div>
  );
}