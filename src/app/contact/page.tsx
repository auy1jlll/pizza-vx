'use client';

import { useState } from 'react';
import { useAppSettingsContext } from '@/contexts/AppSettingsContext';
import { Send, CheckCircle, AlertCircle, Star, Clock, Truck, Award, MapPin, Phone, Users, ChefHat } from 'lucide-react';

export default function ContactPage() {
  const { settings } = useAppSettingsContext();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Parse operating hours
  const operatingHours = settings.operating_hours || {};
  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-700 to-orange-600">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-400 rounded-full opacity-10 animate-pulse"></div>
          <div className="absolute top-20 right-20 w-24 h-24 bg-orange-300 rounded-full opacity-15 animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-white rounded-full opacity-10 animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-16 h-16 bg-yellow-300 rounded-full opacity-20 animate-bounce"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Trust Badge */}
            <div className="inline-flex items-center bg-yellow-400 text-black px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wide shadow-lg mb-8">
              <Star className="w-5 h-5 mr-2 text-yellow-600" />
              ⭐ 4.6/5 Rating • 464 Reviews • Owned Since 2017
            </div>

            <h1 className="text-4xl lg:text-6xl font-black text-white mb-6">
              <span className="text-yellow-300">Get in Touch</span>
              <br />
              <span className="text-white">We're Here to Help!</span>
            </h1>

            <p className="text-xl lg:text-2xl text-gray-100 font-medium leading-relaxed mb-8">
              Have questions about our delicious pizza or need assistance with your order?
              <br />
              <span className="text-yellow-300 font-bold">Contact us today!</span>
            </p>

            {/* Key Benefits */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <div className="flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <Clock className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-semibold text-sm">Quick Response</span>
              </div>
              <div className="flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <Phone className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-semibold text-sm">Phone Support</span>
              </div>
              <div className="flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <Users className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-semibold text-sm">Friendly Staff</span>
              </div>
              <div className="flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <Award className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-semibold text-sm">Best Service</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">

            {/* Contact Form */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Send us a Message</h2>
                <p className="text-gray-600 text-lg">
                  We'd love to hear from you! Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    >
                      <option value="">Select a subject</option>
                      <option value="order">Order Inquiry</option>
                      <option value="catering">Catering Request</option>
                      <option value="feedback">Feedback</option>
                      <option value="complaint">Complaint</option>
                      <option value="general">General Question</option>
                      <option value="location">Location Information</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white resize-vertical"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <div className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-800 font-medium">
                      Thank you! Your message has been sent successfully. We'll get back to you soon.
                    </span>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span className="text-red-800 font-medium">
                      Sorry, there was an error sending your message. Please try again or call us directly.
                    </span>
                  </div>
                )}
              </form>
            </div>

            {/* Contact Information & Hours */}
            <div className="space-y-8">
              {/* Contact Information */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Phone className="w-6 h-6 text-red-600 mr-3" />
                  Contact Information
                </h3>

                <div className="space-y-6">
                  {settings.business_phone && (
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Phone className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Phone</h4>
                        <a
                          href={`tel:${settings.business_phone}`}
                          className="text-green-600 hover:text-green-700 transition-colors font-medium"
                        >
                          {settings.business_phone}
                        </a>
                        <p className="text-sm text-gray-600 mt-1">Call us for orders or questions</p>
                      </div>
                    </div>
                  )}

                  {settings.business_email && (
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 text-xl">✉️</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Email</h4>
                        <a
                          href={`mailto:${settings.business_email}`}
                          className="text-blue-600 hover:text-blue-700 transition-colors font-medium"
                        >
                          {settings.business_email}
                        </a>
                        <p className="text-sm text-gray-600 mt-1">For detailed inquiries</p>
                      </div>
                    </div>
                  )}

                  {settings.business_address && (
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Address</h4>
                        <p className="text-gray-700 font-medium">{settings.business_address}</p>
                        <p className="text-sm text-gray-600 mt-1">Visit us in person</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Operating Hours */}
              <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 border border-red-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Clock className="w-6 h-6 text-red-600 mr-3" />
                  Hours of Operation
                </h3>

                <div className="space-y-3">
                  {daysOfWeek.map((day) => {
                    const dayHoursString = operatingHours[day];
                    const isToday = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() === day;
                    
                    // Parse the time string format "10:30-20:00"
                    let dayHours = null;
                    if (dayHoursString && typeof dayHoursString === 'string' && dayHoursString !== 'closed') {
                      const parts = (dayHoursString as string).split('-');
                      if (parts.length === 2) {
                        dayHours = {
                          open: parts[0].trim(),
                          close: parts[1].trim(),
                          closed: false
                        };
                      }
                    } else if (typeof dayHoursString === 'string' && dayHoursString === 'closed') {
                      dayHours = { closed: true };
                    }

                    return (
                      <div
                        key={day}
                        className={`flex justify-between items-center p-4 rounded-lg transition-all duration-200 ${
                          isToday
                            ? 'bg-red-100 border-2 border-red-300 shadow-md'
                            : 'bg-white/60 border border-gray-200 hover:bg-white/80'
                        }`}
                      >
                        <span className={`font-semibold capitalize ${
                          isToday ? 'text-red-800' : 'text-gray-800'
                        }`}>
                          {day}
                          {isToday && (
                            <span className="ml-2 text-xs bg-red-600 text-white px-2 py-1 rounded-full font-bold">
                              TODAY
                            </span>
                          )}
                        </span>
                        <span className={`font-medium ${
                          isToday ? 'text-red-700' : 'text-gray-700'
                        }`}>
                          {dayHours?.closed ? (
                            <span className="text-red-600 font-bold">Closed</span>
                          ) : dayHours ? (
                            `${dayHours.open} - ${dayHours.close}`
                          ) : (
                            <span className="text-gray-500 italic">Hours not set</span>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Special Note */}
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-yellow-800 font-medium text-sm">
                        Hours are updated regularly from our management portal.
                        For the most current information, please call ahead.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a
                    href="/build-pizza"
                    className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl text-center flex items-center justify-center space-x-2"
                  >
                    <span>🍕</span>
                    <span>Order Now</span>
                  </a>
                  <a
                    href="/menu"
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl text-center flex items-center justify-center space-x-2"
                  >
                    <span>📋</span>
                    <span>View Menu</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
