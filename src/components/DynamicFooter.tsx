'use client';

import { useAppSettingsContext } from '@/contexts/AppSettingsContext';
import Link from 'next/link';

export default function DynamicFooter() {
  const { settings } = useAppSettingsContext();

  // Check if any section should be displayed
  const hasBusinessInfo = settings.business_name || settings.app_name || settings.business_slogan || settings.footer_description;
  const hasContactInfo = settings.business_phone || settings.business_email || settings.business_address || settings.business_website;
  const hasQuickLinks = settings.enable_menu_ordering || settings.enable_pizza_builder || settings.terms_url || settings.privacy_url || settings.refund_policy_url;
  const hasSocialMedia = settings.facebook_url || settings.instagram_url || settings.twitter_url || settings.youtube_url;

  // Don't render footer if no content is available
  if (!hasBusinessInfo && !hasContactInfo && !hasQuickLinks && !hasSocialMedia) {
    return null;
  }

  // Dynamic grid columns based on visible sections
  const visibleSections = [hasBusinessInfo, hasContactInfo, hasQuickLinks, hasSocialMedia].filter(Boolean).length;
  const gridCols = visibleSections === 1 ? 'grid-cols-1' : 
                   visibleSections === 2 ? 'grid-cols-1 md:grid-cols-2' :
                   visibleSections === 3 ? 'grid-cols-1 md:grid-cols-3' :
                   'grid-cols-1 md:grid-cols-4';

  return (
    <footer className="bg-gray-900 text-white py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className={`grid ${gridCols} gap-8`}>
          {/* Business Info */}
          {hasBusinessInfo && (
            <div className="space-y-4">
              {(settings.business_name || settings.app_name) && (
                <h3 className="text-xl font-bold text-orange-400">
                  {settings.business_name || settings.app_name}
                </h3>
              )}
              {settings.business_slogan && (
                <p className="text-gray-300 italic">"{settings.business_slogan}"</p>
              )}
              {settings.footer_description && (
                <p className="text-gray-400 text-sm">{settings.footer_description}</p>
              )}
            </div>
          )}

          {/* Contact Info */}
          {hasContactInfo && (
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-orange-300">Contact Us</h4>
              {settings.business_phone && (
                <p className="text-gray-300">
                  📞 <a href={`tel:${settings.business_phone}`} className="hover:text-orange-300 transition-colors">
                    {settings.business_phone}
                  </a>
                </p>
              )}
              {settings.business_email && (
                <p className="text-gray-300">
                  ✉️ <a href={`mailto:${settings.business_email}`} className="hover:text-orange-300 transition-colors">
                    {settings.business_email}
                  </a>
                </p>
              )}
              {settings.business_address && (
                <p className="text-gray-300">
                  📍 {settings.business_address}
                </p>
              )}
              {settings.business_website && (
                <p className="text-gray-300">
                  🌐 <a href={settings.business_website} target="_blank" rel="noopener noreferrer" className="hover:text-orange-300 transition-colors">
                    Visit Website
                  </a>
                </p>
              )}
            </div>
          )}

          {/* Quick Links */}
          {hasQuickLinks && (
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-orange-300">Quick Links</h4>
              <div className="flex flex-col space-y-2">
                {settings.enable_menu_ordering && (
                  <Link href="/menu" className="text-gray-300 hover:text-orange-300 transition-colors">
                    Menu
                  </Link>
                )}
                {settings.enable_pizza_builder && (
                  <Link href="/pizza-builder" className="text-gray-300 hover:text-orange-300 transition-colors">
                    Pizza Builder
                  </Link>
                )}
                <Link href="/contact" className="text-gray-300 hover:text-orange-300 transition-colors">
                  Contact
                </Link>
                <Link href="/settings-demo" className="text-gray-300 hover:text-orange-300 transition-colors">
                  Settings
                </Link>
                {settings.terms_url && (
                  <a href={settings.terms_url} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-orange-300 transition-colors">
                    Terms of Service
                  </a>
                )}
                {settings.privacy_url && (
                  <a href={settings.privacy_url} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-orange-300 transition-colors">
                    Privacy Policy
                  </a>
                )}
                {settings.refund_policy_url && (
                  <a href={settings.refund_policy_url} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-orange-300 transition-colors">
                    Refund Policy
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Social Media */}
          {hasSocialMedia && (
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-orange-300">Follow Us</h4>
              <div className="flex space-x-4">
                {settings.facebook_url && (
                  <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" 
                     className="text-blue-400 hover:text-blue-300 transition-colors text-2xl"
                     title="Facebook">
                    📘
                  </a>
                )}
                {settings.instagram_url && (
                  <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" 
                     className="text-pink-400 hover:text-pink-300 transition-colors text-2xl"
                     title="Instagram">
                    📷
                  </a>
                )}
                {settings.twitter_url && (
                  <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer" 
                     className="text-blue-300 hover:text-blue-200 transition-colors text-2xl"
                     title="Twitter">
                    🐦
                  </a>
                )}
                {settings.youtube_url && (
                  <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" 
                     className="text-red-400 hover:text-red-300 transition-colors text-2xl"
                     title="YouTube">
                    📺
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        {(settings.app_name || settings.footer_text) && (
          <div className="border-t border-gray-700 mt-8 pt-6 text-center">
            {settings.app_name && (
              <p className="text-gray-400">
                © {new Date().getFullYear()} {settings.app_name}. All rights reserved.
              </p>
            )}
            {settings.footer_text && (
              <p className="mt-2 text-sm text-gray-500">{settings.footer_text}</p>
            )}
          </div>
        )}
      </div>
    </footer>
  );
}
