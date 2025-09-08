'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Clock, Car } from 'lucide-react';

const locations = [
  {
    name: 'Exeter',
    slug: 'exeter',
    address: '123 Main Street, Exeter, NH 03833',
    phone: '(603) 555-0101',
    hours: {
      weekdays: 'Mon-Thu: 11:00 AM - 10:00 PM',
      weekend: 'Fri-Sat: 11:00 AM - 11:00 PM',
      sunday: 'Sun: 12:00 PM - 9:00 PM'
    },
    features: ['Dine-in', 'Takeout', 'Delivery', 'Catering'],
    image: '/images/locations/exeter.jpg'
  },
  {
    name: 'Hampton',
    slug: 'hampton',
    address: '456 Ocean Boulevard, Hampton, NH 03842',
    phone: '(603) 555-0102',
    hours: {
      weekdays: 'Mon-Thu: 11:00 AM - 10:00 PM',
      weekend: 'Fri-Sat: 11:00 AM - 11:00 PM',
      sunday: 'Sun: 12:00 PM - 9:00 PM'
    },
    features: ['Dine-in', 'Takeout', 'Delivery', 'Beachside Patio'],
    image: '/images/locations/hampton.jpg'
  },
  {
    name: 'Newington',
    slug: 'newington',
    address: '789 Woodbury Avenue, Newington, NH 03801',
    phone: '(603) 555-0103',
    hours: {
      weekdays: 'Mon-Thu: 11:00 AM - 10:00 PM',
      weekend: 'Fri-Sat: 11:00 AM - 11:00 PM',
      sunday: 'Sun: 12:00 PM - 9:00 PM'
    },
    features: ['Dine-in', 'Takeout', 'Delivery', 'Drive-thru'],
    image: '/images/locations/newington.jpg'
  },
  {
    name: 'Portsmouth',
    slug: 'portsmouth',
    address: '321 Market Street, Portsmouth, NH 03801',
    phone: '(603) 555-0104',
    hours: {
      weekdays: 'Mon-Thu: 11:00 AM - 10:00 PM',
      weekend: 'Fri-Sat: 11:00 AM - 11:00 PM',
      sunday: 'Sun: 12:00 PM - 9:00 PM'
    },
    features: ['Dine-in', 'Takeout', 'Delivery', 'Historic Downtown'],
    image: '/images/locations/portsmouth.jpg'
  },
  {
    name: 'Rye',
    slug: 'rye',
    address: '654 Ocean Road, Rye, NH 03870',
    phone: '(603) 555-0105',
    hours: {
      weekdays: 'Mon-Thu: 11:00 AM - 10:00 PM',
      weekend: 'Fri-Sat: 11:00 AM - 11:00 PM',
      sunday: 'Sun: 12:00 PM - 9:00 PM'
    },
    features: ['Dine-in', 'Takeout', 'Delivery', 'Ocean View'],
    image: '/images/locations/rye.jpg'
  }
];

export default function LocationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Our Locations
          </h1>
          <p className="text-xl md:text-2xl text-orange-100 max-w-3xl mx-auto">
            Find your nearest Greenland Famous Pizza location and enjoy our delicious pizzas, 
            roast beef sandwiches, and calzones!
          </p>
        </div>
      </div>

      {/* Locations Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {locations.map((location) => (
            <div 
              key={location.slug}
              className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              {/* Location Image */}
              <div className="h-48 bg-gradient-to-br from-orange-400 to-red-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <MapPin size={48} className="mx-auto mb-2" />
                    <h3 className="text-2xl font-bold">{location.name}</h3>
                  </div>
                </div>
              </div>

              {/* Location Info */}
              <div className="p-6">
                {/* Address */}
                <div className="flex items-start space-x-3 mb-4">
                  <MapPin size={20} className="text-orange-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">{location.address}</p>
                </div>

                {/* Phone */}
                <div className="flex items-center space-x-3 mb-4">
                  <Phone size={20} className="text-orange-600 flex-shrink-0" />
                  <a 
                    href={`tel:${location.phone}`}
                    className="text-gray-700 hover:text-orange-600 transition-colors"
                  >
                    {location.phone}
                  </a>
                </div>

                {/* Hours */}
                <div className="flex items-start space-x-3 mb-4">
                  <Clock size={20} className="text-orange-600 mt-1 flex-shrink-0" />
                  <div className="text-gray-700 text-sm">
                    <p>{location.hours.weekdays}</p>
                    <p>{location.hours.weekend}</p>
                    <p>{location.hours.sunday}</p>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {location.features.map((feature) => (
                      <span 
                        key={feature}
                        className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <Link
                    href={`/${location.slug}`}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors text-center"
                  >
                    View Details
                  </Link>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(location.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors"
                  >
                    <Car size={20} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Can't Find Your Location?
            </h2>
            <p className="text-gray-600 mb-6">
              We're always expanding! Contact us to inquire about delivery to your area 
              or to suggest a new location.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Contact Us
              </Link>
              <Link
                href="/build-pizza"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Order Online
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
