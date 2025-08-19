'use client';

import { useAppSettingsContext } from '@/contexts/AppSettingsContext';

export default function ContactPage() {
  const { settings } = useAppSettingsContext();

  // Parse operating hours
  const operatingHours = settings.operating_hours || {};
  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-orange-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Contact {settings.business_name || settings.app_name || 'Us'}
            </h1>
            {settings.business_slogan && (
              <p className="text-xl text-gray-600 italic">"{settings.business_slogan}"</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="text-orange-500 mr-3">📞</span>
                Get in Touch
              </h2>
              
              <div className="space-y-6">
                {settings.business_phone && (
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-xl">📞</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Phone</h3>
                      <a href={`tel:${settings.business_phone}`} 
                         className="text-green-600 hover:text-green-700 transition-colors">
                        {settings.business_phone}
                      </a>
                    </div>
                  </div>
                )}

                {settings.business_email && (
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-xl">✉️</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Email</h3>
                      <a href={`mailto:${settings.business_email}`} 
                         className="text-blue-600 hover:text-blue-700 transition-colors">
                        {settings.business_email}
                      </a>
                    </div>
                  </div>
                )}

                {settings.business_address && (
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 text-xl">📍</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Address</h3>
                      <p className="text-gray-600">{settings.business_address}</p>
                    </div>
                  </div>
                )}

                {settings.business_website && (
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 text-xl">🌐</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Website</h3>
                      <a href={settings.business_website} target="_blank" rel="noopener noreferrer"
                         className="text-purple-600 hover:text-purple-700 transition-colors">
                        Visit our website
                      </a>
                    </div>
                  </div>
                )}

                {/* Social Media */}
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4">Follow Us</h3>
                  <div className="flex space-x-4">
                    {settings.facebook_url && (
                      <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer"
                         className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                        📘
                      </a>
                    )}
                    {settings.instagram_url && (
                      <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer"
                         className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center text-white hover:bg-pink-700 transition-colors">
                        📷
                      </a>
                    )}
                    {settings.twitter_url && (
                      <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer"
                         className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-white hover:bg-blue-500 transition-colors">
                        🐦
                      </a>
                    )}
                    {settings.youtube_url && (
                      <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer"
                         className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-700 transition-colors">
                        📺
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="bg-white rounded-lg shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="text-green-500 mr-3">🕒</span>
                Hours of Operation
              </h2>

              <div className="space-y-4">
                {daysOfWeek.map((day) => {
                  const dayHours = operatingHours[day];
                  const isToday = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() === day;
                  
                  return (
                    <div key={day} 
                         className={`flex justify-between items-center p-3 rounded-lg ${
                           isToday ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                         }`}>
                      <span className={`font-medium capitalize ${
                        isToday ? 'text-green-700' : 'text-gray-700'
                      }`}>
                        {day}
                        {isToday && <span className="ml-2 text-sm">(Today)</span>}
                      </span>
                      <span className={`${
                        isToday ? 'text-green-600 font-semibold' : 'text-gray-600'
                      }`}>
                        {dayHours?.closed ? 'Closed' : 
                         dayHours ? `${dayHours.open} - ${dayHours.close}` : 
                         'Hours not set'}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Additional Info */}
              <div className="mt-8 p-4 bg-orange-50 rounded-lg border border-orange-200">
                <h3 className="font-semibold text-orange-800 mb-2">🍕 Order Information</h3>
                <div className="space-y-2 text-sm text-orange-700">
                  {settings.preparation_time && (
                    <p>⏱️ Average preparation time: {settings.preparation_time} minutes</p>
                  )}
                  {settings.minimum_order && (
                    <p>💰 Minimum order: ${settings.minimum_order.toFixed(2)}</p>
                  )}
                  {settings.delivery_fee && (
                    <p>🚚 Delivery fee: ${settings.delivery_fee.toFixed(2)}</p>
                  )}
                  {settings.tax_rate && (
                    <p>📋 Tax rate: {(settings.tax_rate * 100).toFixed(1)}%</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
