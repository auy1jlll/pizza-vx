'use client';

import AdminLayout from '@/components/AdminLayout';
import { BookOpen, Download, FileText, HelpCircle, Settings, Zap } from 'lucide-react';

export default function AdminHelpPage() {
  const documentationLinks = [
    {
      title: 'Admin User Guide',
      description: 'Complete guide for managing the restaurant system',
      icon: <BookOpen className="w-6 h-6" />,
      href: '/api/docs/ADMIN_USER_GUIDE.md',
      sections: ['User Management', 'Order Management', 'Pizza Configuration', 'Menu Items', 'System Settings', 'Reports & Analytics'],
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Quick Reference Guide',
      description: 'Daily tasks and quick navigation help',
      icon: <Zap className="w-6 h-6" />,
      href: '/api/docs/QUICK_REFERENCE.md',
      sections: ['Daily Checklist', 'Order Status Workflow', 'Emergency Procedures', 'Contact Information'],
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Technical Documentation',
      description: 'System architecture and development guide',
      icon: <Settings className="w-6 h-6" />,
      href: '/api/docs/TECHNICAL_HANDOVER.md',
      sections: ['Technology Stack', 'API Endpoints', 'Database Schema', 'Authentication System'],
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Deployment Guide',
      description: 'Production setup and operations manual',
      icon: <FileText className="w-6 h-6" />,
      href: '/api/docs/DEPLOYMENT_OPERATIONS.md',
      sections: ['Production Setup', 'Database Backup', 'Security Configuration', 'Monitoring'],
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const quickHelp = [
    {
      question: 'How do I add a new pizza size?',
      answer: 'Go to Pizza Manager → Sizes → Click "+ Add Size" → Enter name and base price → Save',
      category: 'Pizza Management'
    },
    {
      question: 'How do I update an order status?',
      answer: 'Go to Orders → Find the order → Click status dropdown → Select new status',
      category: 'Order Management'
    },
    {
      question: 'How do I add a new employee?',
      answer: 'Go to User Management → Employees → Click "+ Add Employee" → Fill in details → Save',
      category: 'User Management'
    },
    {
      question: 'How do I view sales reports?',
      answer: 'Go to Dashboard for overview or Reports section for detailed analytics',
      category: 'Analytics'
    },
    {
      question: 'Why is customer spending showing $0.00?',
      answer: 'Customer profile may be missing. Contact technical support to create the profile.',
      category: 'Troubleshooting'
    }
  ];

  const handleDownloadGuide = (href: string) => {
    // Open the documentation file in a new tab
    window.open(href, '_blank');
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-xl">
                <HelpCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Help & Documentation
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Complete guides and resources for managing your pizza ordering system
            </p>
          </div>

          {/* Documentation Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            {documentationLinks.map((doc, index) => (
              <div
                key={index}
                className="bg-black/30 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:bg-black/40 transition-all duration-300 group"
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 bg-gradient-to-r ${doc.color} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {doc.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{doc.title}</h3>
                    <p className="text-white/60 mb-4">{doc.description}</p>
                    
                    {/* Sections */}
                    <div className="mb-4">
                      <p className="text-sm font-medium text-white/40 mb-2">Covers:</p>
                      <div className="flex flex-wrap gap-2">
                        {doc.sections.map((section, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-white/10 rounded-lg text-xs text-white/70"
                          >
                            {section}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleDownloadGuide(doc.href)}
                      className={`w-full bg-gradient-to-r ${doc.color} hover:scale-105 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg flex items-center justify-center space-x-2`}
                    >
                      <Download className="w-4 h-4" />
                      <span>View Guide</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Help Section */}
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <HelpCircle className="w-6 h-6 mr-3 text-blue-400" />
              Frequently Asked Questions
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {quickHelp.map((item, index) => (
                <div
                  key={index}
                  className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-white text-sm">{item.question}</h3>
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-lg shrink-0 ml-2">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-white/60 text-sm">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Support Contact */}
          <div className="mt-8 bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-2xl border border-orange-500/20 p-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-2">Need Additional Help?</h3>
              <p className="text-white/60 mb-4">
                Can't find what you're looking for? Contact your system administrator or technical support team.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <p className="text-sm font-medium text-white">Technical Issues</p>
                  <p className="text-xs text-white/60">Contact IT Support</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <p className="text-sm font-medium text-white">Training Questions</p>
                  <p className="text-xs text-white/60">Operations Manager</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <p className="text-sm font-medium text-white">System Updates</p>
                  <p className="text-xs text-white/60">Development Team</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="/management-portal"
              className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-4 text-center hover:bg-black/30 transition-all duration-300 group"
            >
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">🎯</div>
              <p className="text-white font-medium text-sm">Dashboard</p>
            </a>
            <a
              href="/management-portal/orders"
              className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-4 text-center hover:bg-black/30 transition-all duration-300 group"
            >
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">📋</div>
              <p className="text-white font-medium text-sm">Orders</p>
            </a>
            <a
              href="/management-portal/users"
              className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-4 text-center hover:bg-black/30 transition-all duration-300 group"
            >
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">👥</div>
              <p className="text-white font-medium text-sm">Users</p>
            </a>
            <a
              href="/management-portal/pizza-manager"
              className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-4 text-center hover:bg-black/30 transition-all duration-300 group"
            >
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">🍕</div>
              <p className="text-white font-medium text-sm">Pizza Manager</p>
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
