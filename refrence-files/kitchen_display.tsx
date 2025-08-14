import React, { useState, useEffect } from 'react';
import { Clock, Printer, AlertCircle, Timer, Phone, MapPin, User } from 'lucide-react';

const KitchenDisplay = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([
    {
      id: 101,
      customerName: "Sarah Johnson",
      phone: "(555) 123-4567",
      type: "pickup",
      status: "pending",
      priority: "normal",
      orderTime: new Date(Date.now() - 5 * 60000), // 5 minutes ago
      estimatedTime: 12, // minutes
      items: [
        { name: "Big Mac", quantity: 2, special: "No pickles" },
        { name: "Large Fries", quantity: 2, special: "" },
        { name: "Coca-Cola", quantity: 1, special: "Light ice" },
        { name: "McFlurry Oreo", quantity: 1, special: "Extra Oreos" }
      ],
      specialInstructions: "Customer has nut allergy - please use clean surfaces"
    },
    {
      id: 102,
      customerName: "Mike Davis",
      phone: "(555) 987-6543",
      type: "delivery",
      address: "123 Oak Street",
      status: "preparing",
      priority: "rush",
      orderTime: new Date(Date.now() - 8 * 60000), // 8 minutes ago
      estimatedTime: 10,
      items: [
        { name: "Quarter Pounder", quantity: 1, special: "Extra cheese" },
        { name: "Medium Fries", quantity: 1, special: "" },
        { name: "Apple Pie", quantity: 2, special: "" }
      ],
      specialInstructions: "Rush delivery - customer waiting"
    },
    {
      id: 103,
      customerName: "Emma Wilson",
      phone: "(555) 456-7890",
      type: "pickup",
      status: "ready",
      priority: "normal",
      orderTime: new Date(Date.now() - 15 * 60000), // 15 minutes ago
      estimatedTime: 8,
      items: [
        { name: "Chicken McNuggets (20pc)", quantity: 1, special: "" },
        { name: "BBQ Sauce", quantity: 3, special: "" },
        { name: "Medium Sprite", quantity: 1, special: "" }
      ],
      specialInstructions: ""
    },
    {
      id: 104,
      customerName: "David Brown",
      phone: "(555) 321-0987",
      type: "delivery",
      address: "456 Pine Avenue",
      status: "pending",
      priority: "normal",
      orderTime: new Date(Date.now() - 2 * 60000), // 2 minutes ago
      estimatedTime: 15,
      items: [
        { name: "Fish Filet", quantity: 1, special: "No tartar sauce" },
        { name: "Small Fries", quantity: 1, special: "" },
        { name: "Coffee", quantity: 1, special: "2 cream, 1 sugar" }
      ],
      specialInstructions: ""
    },
    {
      id: 105,
      customerName: "Lisa Anderson",
      phone: "(555) 654-3210",
      type: "pickup",
      status: "preparing",
      priority: "rush",
      orderTime: new Date(Date.now() - 12 * 60000), // 12 minutes ago
      estimatedTime: 8,
      items: [
        { name: "Double Cheeseburger", quantity: 2, special: "Only ketchup and mustard" },
        { name: "Large Fries", quantity: 1, special: "" },
        { name: "Milkshake Vanilla", quantity: 1, special: "Extra thick" }
      ],
      specialInstructions: "Birthday order - please double-check everything"
    }
  ]);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate elapsed time for each order
  const getElapsedTime = (orderTime) => {
    const elapsed = Math.floor((currentTime - orderTime) / 60000);
    return elapsed;
  };

  // Get urgency color based on elapsed vs estimated time
  const getUrgencyColor = (orderTime, estimatedTime) => {
    const elapsed = getElapsedTime(orderTime);
    const ratio = elapsed / estimatedTime;
    
    if (ratio >= 1) return 'text-red-400 bg-red-900/30';
    if (ratio >= 0.7) return 'text-yellow-400 bg-yellow-900/30';
    return 'text-green-400 bg-green-900/30';
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-blue-600';
      case 'preparing': return 'bg-orange-600';
      case 'ready': return 'bg-green-600';
      case 'complete': return 'bg-gray-600';
      default: return 'bg-gray-600';
    }
  };

  // Update order status
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  // Print order
  const printOrder = (order) => {
    const printContent = `
================================
        KITCHEN ORDER
================================
Order #: ${order.id}
Time: ${order.orderTime.toLocaleTimeString()}
${order.priority === 'rush' ? '*** RUSH ORDER ***' : ''}

Customer: ${order.customerName}
Phone: ${order.phone}
Type: ${order.type.toUpperCase()}
${order.address ? `Address: ${order.address}` : ''}

--------------------------------
ITEMS:
--------------------------------
${order.items.map(item => 
  `${item.quantity}x ${item.name}${item.special ? `\n   *${item.special}` : ''}`
).join('\n')}

--------------------------------
${order.specialInstructions ? `SPECIAL INSTRUCTIONS:\n${order.specialInstructions}\n--------------------------------` : ''}
Estimated Time: ${order.estimatedTime} minutes
Status: ${order.status.toUpperCase()}

================================
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Kitchen Order ${order.id}</title>
          <style>
            body { 
              font-family: 'Courier New', monospace; 
              font-size: 12px; 
              line-height: 1.4;
              margin: 20px;
              background: white;
              color: black;
            }
            pre { margin: 0; }
          </style>
        </head>
        <body>
          <pre>${printContent}</pre>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // Get status counts
  const getStatusCounts = () => {
    return {
      pending: orders.filter(o => o.status === 'pending').length,
      preparing: orders.filter(o => o.status === 'preparing').length,
      ready: orders.filter(o => o.status === 'ready').length,
      total: orders.length
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold text-white">Kitchen Display System</h1>
          <div className="flex items-center gap-2 text-3xl font-mono bg-gray-800 px-6 py-3 rounded-lg">
            <Clock size={32} />
            {currentTime.toLocaleTimeString()}
          </div>
        </div>
        
        {/* Status Overview */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-800 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold">{statusCounts.pending}</div>
            <div className="text-blue-200">Pending</div>
          </div>
          <div className="bg-orange-800 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold">{statusCounts.preparing}</div>
            <div className="text-orange-200">Preparing</div>
          </div>
          <div className="bg-green-800 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold">{statusCounts.ready}</div>
            <div className="text-green-200">Ready</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold">{statusCounts.total}</div>
            <div className="text-gray-200">Total Orders</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Orders Grid */}
        <div className="col-span-8">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {orders.map(order => (
              <div
                key={order.id}
                className={`bg-gray-800 rounded-lg p-6 cursor-pointer transition-all duration-200 hover:bg-gray-700 hover:shadow-lg border-l-4 ${
                  order.priority === 'rush' ? 'border-red-500' : 'border-gray-600'
                }`}
                onClick={() => setSelectedOrder(order)}
              >
                {/* Order Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-white">#{order.id}</span>
                    {order.priority === 'rush' && (
                      <div className="flex items-center gap-1 bg-red-600 px-2 py-1 rounded text-sm">
                        <AlertCircle size={16} />
                        RUSH
                      </div>
                    )}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                    {order.status.toUpperCase()}
                  </div>
                </div>

                {/* Customer Info */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <User size={16} className="text-gray-400" />
                    <span className="font-semibold">{order.customerName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    {order.type === 'pickup' ? (
                      <MapPin size={16} className="text-gray-400" />
                    ) : (
                      <Phone size={16} className="text-gray-400" />
                    )}
                    <span className="text-sm">{order.type === 'pickup' ? 'Pickup' : `Delivery - ${order.address}`}</span>
                  </div>
                </div>

                {/* Timer */}
                <div className={`flex items-center gap-2 mb-4 p-2 rounded ${getUrgencyColor(order.orderTime, order.estimatedTime)}`}>
                  <Timer size={16} />
                  <span className="font-mono font-bold">
                    {getElapsedTime(order.orderTime)}m / {order.estimatedTime}m
                  </span>
                </div>

                {/* Items Preview */}
                <div className="mb-4">
                  <div className="text-sm text-gray-300 mb-2">{order.items.length} items:</div>
                  <div className="space-y-1">
                    {order.items.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="text-sm">
                        <span className="font-semibold">{item.quantity}x</span> {item.name}
                        {item.special && <span className="text-yellow-400 ml-2">*{item.special}</span>}
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="text-sm text-gray-400">+{order.items.length - 3} more items</div>
                    )}
                  </div>
                </div>

                {/* Special Instructions */}
                {order.specialInstructions && (
                  <div className="bg-yellow-900/30 border border-yellow-600 p-2 rounded mb-4">
                    <div className="text-yellow-400 font-semibold text-sm mb-1">Special Instructions:</div>
                    <div className="text-sm">{order.specialInstructions}</div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      printOrder(order);
                    }}
                    className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded text-sm transition-colors"
                  >
                    <Printer size={16} />
                    Print
                  </button>
                  {order.status !== 'complete' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const nextStatus = {
                          'pending': 'preparing',
                          'preparing': 'ready',
                          'ready': 'complete'
                        };
                        updateOrderStatus(order.id, nextStatus[order.status]);
                      }}
                      className="bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded text-sm transition-colors"
                    >
                      {order.status === 'pending' && 'Start Preparing'}
                      {order.status === 'preparing' && 'Mark Ready'}
                      {order.status === 'ready' && 'Complete'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Details Panel */}
        <div className="col-span-4">
          <div className="bg-gray-800 rounded-lg p-6 sticky top-6">
            {selectedOrder ? (
              <div>
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  Order #{selectedOrder.id}
                  {selectedOrder.priority === 'rush' && (
                    <span className="bg-red-600 px-2 py-1 rounded text-sm">RUSH</span>
                  )}
                </h3>

                {/* Customer Details */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 text-gray-300">Customer Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Name:</strong> {selectedOrder.customerName}</div>
                    <div><strong>Phone:</strong> {selectedOrder.phone}</div>
                    <div><strong>Type:</strong> {selectedOrder.type}</div>
                    {selectedOrder.address && <div><strong>Address:</strong> {selectedOrder.address}</div>}
                    <div><strong>Order Time:</strong> {selectedOrder.orderTime.toLocaleTimeString()}</div>
                    <div><strong>Estimated:</strong> {selectedOrder.estimatedTime} minutes</div>
                  </div>
                </div>

                {/* Items */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 text-gray-300">Order Items</h4>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="bg-gray-700 p-3 rounded">
                        <div className="font-semibold">
                          {item.quantity}x {item.name}
                        </div>
                        {item.special && (
                          <div className="text-yellow-400 text-sm mt-1">
                            Special: {item.special}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Special Instructions */}
                {selectedOrder.specialInstructions && (
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3 text-gray-300">Special Instructions</h4>
                    <div className="bg-yellow-900/30 border border-yellow-600 p-3 rounded">
                      {selectedOrder.specialInstructions}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-3">
                  <button
                    onClick={() => printOrder(selectedOrder)}
                    className="w-full flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 py-3 rounded transition-colors"
                  >
                    <Printer size={20} />
                    Print Kitchen Receipt
                  </button>
                  
                  {selectedOrder.status !== 'complete' && (
                    <button
                      onClick={() => {
                        const nextStatus = {
                          'pending': 'preparing',
                          'preparing': 'ready',
                          'ready': 'complete'
                        };
                        updateOrderStatus(selectedOrder.id, nextStatus[selectedOrder.status]);
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded transition-colors"
                    >
                      {selectedOrder.status === 'pending' && 'Start Preparing'}
                      {selectedOrder.status === 'preparing' && 'Mark as Ready'}
                      {selectedOrder.status === 'ready' && 'Mark Complete'}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-12">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl mb-2">Select an Order</h3>
                <p>Click on any order card to view detailed information and manage the order status.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KitchenDisplay;