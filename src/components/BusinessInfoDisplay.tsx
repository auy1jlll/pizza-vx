'use client';

import { useBusinessInfo } from '@/hooks/useAppSettings';

interface BusinessInfoProps {
  variant?: 'horizontal' | 'vertical' | 'compact';
  showSlogan?: boolean;
  showContact?: boolean;
  className?: string;
}

export default function BusinessInfoDisplay({ 
  variant = 'vertical', 
  showSlogan = true, 
  showContact = true,
  className = '' 
}: BusinessInfoProps) {
  const businessInfo = useBusinessInfo();

  if (!businessInfo) return null;

  const baseClasses = `space-y-2 ${className}`;

  if (variant === 'horizontal') {
    return (
      <div className={`flex items-center space-x-6 ${className}`}>
        <div>
          <h3 className="text-lg font-bold text-gray-900">{businessInfo.name}</h3>
          {showSlogan && businessInfo.slogan && (
            <p className="text-sm text-gray-600 italic">"{businessInfo.slogan}"</p>
          )}
        </div>
        {showContact && (
          <div className="flex items-center space-x-4 text-sm">
            {businessInfo.phone && (
              <a href={`tel:${businessInfo.phone}`} 
                 className="text-green-600 hover:text-green-700 transition-colors">
                📞 {businessInfo.phone}
              </a>
            )}
            {businessInfo.email && (
              <a href={`mailto:${businessInfo.email}`} 
                 className="text-blue-600 hover:text-blue-700 transition-colors">
                ✉️ Email
              </a>
            )}
          </div>
        )}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={baseClasses}>
        <h4 className="font-semibold text-gray-900">{businessInfo.name}</h4>
        {showContact && businessInfo.phone && (
          <p className="text-sm text-gray-600">📞 {businessInfo.phone}</p>
        )}
      </div>
    );
  }

  // Default vertical layout
  return (
    <div className={baseClasses}>
      <h3 className="text-xl font-bold text-gray-900">{businessInfo.name}</h3>
      {showSlogan && businessInfo.slogan && (
        <p className="text-gray-600 italic">"{businessInfo.slogan}"</p>
      )}
      
      {showContact && (
        <div className="space-y-1 text-sm">
          {businessInfo.phone && (
            <p className="text-gray-700">
              📞 <a href={`tel:${businessInfo.phone}`} 
                   className="hover:text-green-600 transition-colors">
                {businessInfo.phone}
              </a>
            </p>
          )}
          {businessInfo.email && (
            <p className="text-gray-700">
              ✉️ <a href={`mailto:${businessInfo.email}`} 
                   className="hover:text-blue-600 transition-colors">
                {businessInfo.email}
              </a>
            </p>
          )}
          {businessInfo.address && (
            <p className="text-gray-700">📍 {businessInfo.address}</p>
          )}
          {businessInfo.website && (
            <p className="text-gray-700">
              🌐 <a href={businessInfo.website} target="_blank" rel="noopener noreferrer"
                   className="hover:text-purple-600 transition-colors">
                Visit Website
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
