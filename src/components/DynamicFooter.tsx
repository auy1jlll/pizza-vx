'use client';

import { useAppSettingsContext } from '@/contexts/AppSettingsContext';
import Link from 'next/link';
import { useState, useEffect } from 'react';

// Helper function to get all week working hours
function getAllWeekHours(operatingHours: any) {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const today = new Date().getDay();
  const todayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][today];
  
  return days.map(day => {
    const dayHours = operatingHours[day];
    return {
      day: day.charAt(0).toUpperCase() + day.slice(1),
      dayShort: day.slice(0, 3).toUpperCase(),
      hours: dayHours,
      isOpen: dayHours && !dayHours.closed,
      isToday: day === todayName
    };
  });
}

export default function DynamicFooter() {
  const { settings } = useAppSettingsContext();
  const [isClient, setIsClient] = useState(false);

  // Prevent hydration mismatch by only showing dynamic content on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check if any section should be displayed
  const hasBusinessInfo = settings.business_name || settings.app_name || settings.business_slogan || settings.footer_description;
  const hasContactInfo = settings.business_phone || settings.business_email || settings.business_address || settings.business_website;
  const hasQuickLinks = true; // Always show Quick Links as we have Contact, SEO pages, and other essential links
  const hasSocialMedia = settings.facebook_url || settings.instagram_url || settings.twitter_url || settings.youtube_url;
  const hasWorkingHours = settings.operating_hours && Object.keys(settings.operating_hours).length > 0;

  // Don't render footer if no content is available
  if (!hasBusinessInfo && !hasContactInfo && !hasQuickLinks && !hasSocialMedia && !hasWorkingHours) {
    return null;
  }

  // Dynamic grid columns based on visible sections
  const visibleSections = [hasBusinessInfo, hasContactInfo, hasQuickLinks, hasSocialMedia, hasWorkingHours].filter(Boolean).length;
  const gridCols = visibleSections === 1 ? 'grid-cols-1' : 
                   visibleSections === 2 ? 'grid-cols-1 md:grid-cols-2' :
                   visibleSections === 3 ? 'grid-cols-1 md:grid-cols-3' :
                   visibleSections === 4 ? 'grid-cols-1 md:grid-cols-4' :
                   'grid-cols-1 md:grid-cols-5';

  return (
    <footer className="bg-gray-900 text-white py-4 mt-8">
      <div className="container mx-auto px-4">
        <div className={`grid ${gridCols} gap-4`}>
          {/* Business Info */}
          {hasBusinessInfo && (
            <div className="space-y-2">
              {(settings.business_name || settings.app_name) && (
                <h3 className="text-lg font-bold text-orange-400">
                  {settings.business_name || settings.app_name}
                </h3>
              )}
              {settings.business_slogan && (
                <p className="text-gray-300 italic text-sm">"{settings.business_slogan}"</p>
              )}
              {settings.footer_description && (
                <p className="text-gray-400 text-xs">{settings.footer_description}</p>
              )}
            </div>
          )}

          {/* Contact Info */}
          {hasContactInfo && (
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-orange-300 mb-2">Contact</h4>
              {settings.business_phone && (
                <p className="text-gray-300 text-xs">
                  📞 <a href={`tel:${settings.business_phone}`} className="hover:text-orange-300 transition-colors">
                    {settings.business_phone}
                  </a>
                </p>
              )}
              {settings.business_email && (
                <p className="text-gray-300 text-xs">
                  ✉️ <a href={`mailto:${settings.business_email}`} className="hover:text-orange-300 transition-colors">
                    {settings.business_email}
                  </a>
                </p>
              )}
              {settings.business_address && (
                <p className="text-gray-300 text-xs">
                  📍 {settings.business_address}
                </p>
              )}
              {settings.business_website && (
                <p className="text-gray-300 text-xs">
                  🌐 <a href={settings.business_website} target="_blank" rel="noopener noreferrer" className="hover:text-orange-300 transition-colors">
                    Visit Website
                  </a>
                </p>
              )}
            </div>
          )}

          {/* Quick Links */}
          {hasQuickLinks && (
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-orange-300 mb-2">Links</h4>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                {settings.enable_menu_ordering && (
                  <Link href="/menu" className="text-gray-300 hover:text-orange-300 transition-colors">
                    Menu
                  </Link>
                )}
                {settings.enable_pizza_builder && (
                  <Link href="/build-pizza" className="text-gray-300 hover:text-orange-300 transition-colors">
                    Pizza Builder
                  </Link>
                )}
                <Link href="/contact" className="text-gray-300 hover:text-orange-300 transition-colors">
                  Contact
                </Link>
                {/* SEO Pages */}
                <Link href="/home" className="text-gray-300 hover:text-orange-300 transition-colors">
                  Our Story
                </Link>
                <Link href="/about-us" className="text-gray-300 hover:text-orange-300 transition-colors">
                  About Us
                </Link>
                <Link href="/menu" className="text-gray-300 hover:text-orange-300 transition-colors">
                  Menu & Prices
                </Link>
                <Link href="/delivery" className="text-gray-300 hover:text-orange-300 transition-colors">
                  Delivery
                </Link>
                {settings.terms_url && (
                  <a href={settings.terms_url} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-orange-300 transition-colors">
                    Terms
                  </a>
                )}
                {settings.privacy_url && (
                  <a href={settings.privacy_url} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-orange-300 transition-colors">
                    Privacy
                  </a>
                )}
                {settings.refund_policy_url && (
                  <a href={settings.refund_policy_url} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-orange-300 transition-colors">
                    Refunds
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Social Media */}
          {hasSocialMedia && (
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-orange-300 mb-2">Follow Us</h4>
              <div className="flex space-x-3">
                {settings.facebook_url && (
                  <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" 
                     className="text-blue-400 hover:text-blue-300 transition-colors text-lg"
                     title="Facebook">
                    📘
                  </a>
                )}
                {settings.instagram_url && (
                  <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" 
                     className="text-pink-400 hover:text-pink-300 transition-colors text-lg"
                     title="Instagram">
                    📷
                  </a>
                )}
                {settings.twitter_url && (
                  <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer" 
                     className="text-blue-300 hover:text-blue-200 transition-colors text-lg"
                     title="Twitter">
                    🐦
                  </a>
                )}
                {settings.youtube_url && (
                  <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" 
                     className="text-red-400 hover:text-red-300 transition-colors text-lg"
                     title="YouTube">
                    📺
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Working Hours - Full Week Card */}
          {hasWorkingHours && isClient && (() => {
            const weekHours = getAllWeekHours(settings.operating_hours);
            return (
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-orange-300 mb-2">Hours</h4>
                <div className="bg-gray-800 rounded p-2 border border-gray-700 space-y-1">
                  {weekHours.map((dayInfo) => (
                    <div 
                      key={dayInfo.day} 
                      className={`flex items-center justify-between py-0.5 px-1 rounded text-xs ${
                        dayInfo.isToday ? 'bg-orange-900/30 border border-orange-700' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-1">
                        <span className={`font-medium ${
                          dayInfo.isToday ? 'text-orange-400' : 'text-gray-400'
                        }`}>
                          {dayInfo.dayShort}
                        </span>
                        {dayInfo.isToday && (
                          <span className="text-xs">🕒</span>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-gray-300">
                          {dayInfo.isOpen 
                            ? `${dayInfo.hours.open} - ${dayInfo.hours.close}`
                            : 'Closed'
                          }
                        </span>
                        {dayInfo.isToday && (
                          <span className={`text-xs px-1 py-0.5 rounded-full ${
                            dayInfo.isOpen 
                              ? 'bg-green-900 text-green-300' 
                              : 'bg-red-900 text-red-300'
                          }`}>
                            {dayInfo.isOpen ? 'Open' : 'Closed'}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Bottom Bar */}
        {(settings.app_name || settings.footer_text) && (
          <div className="border-t border-gray-700 mt-4 pt-3 text-center">
            {settings.app_name && (
              <p className="text-gray-400 text-xs">
                © {new Date().getFullYear()} {settings.app_name}. All rights reserved.
              </p>
            )}
            {settings.footer_text && (
              <p className="mt-1 text-xs text-gray-500">{settings.footer_text}</p>
            )}
          </div>
        )}
      </div>
    </footer>
  );
}
