import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Edit, FileText, Image } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Content Management - RestoApp Admin',
  description: 'Manage website content with TinaCMS',
};

export default function ContentManagementPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              href="/admin"
              className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Admin</span>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-white mb-4">
                Content Management System
              </h1>
              <p className="text-xl text-white/80 max-w-2xl mx-auto">
                Manage your website content easily with TinaCMS. Edit pages, upload images, and update settings directly from your browser.
              </p>
            </div>

            {/* CMS Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* TinaCMS Admin */}
              <a
                href="/admin/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="group backdrop-blur-sm bg-white/5 border border-white/20 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:border-orange-500/30"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-orange-500/20 rounded-xl">
                    <Edit className="w-6 h-6 text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-orange-300 transition-colors">
                      TinaCMS Editor
                    </h3>
                    <p className="text-white/70 text-sm">
                      Access the full TinaCMS interface to edit content, manage pages, and upload media.
                    </p>
                  </div>
                </div>
              </a>

              {/* Pages Management */}
              <Link
                href="/pages/about"
                className="group backdrop-blur-sm bg-white/5 border border-white/20 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:border-blue-500/30"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-500/20 rounded-xl">
                    <FileText className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">
                      View Sample Page
                    </h3>
                    <p className="text-white/70 text-sm">
                      See how TinaCMS-managed content appears on your website.
                    </p>
                  </div>
                </div>
              </Link>

              {/* Content Files */}
              <div className="group backdrop-blur-sm bg-white/5 border border-white/20 rounded-2xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-green-500/20 rounded-xl">
                    <Image className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Content Structure
                    </h3>
                    <p className="text-white/70 text-sm mb-3">
                      Your content is organized in markdown files:
                    </p>
                    <ul className="text-xs text-white/60 space-y-1">
                      <li>• <code>/content/pages/</code> - Website pages</li>
                      <li>• <code>/content/menu/</code> - Menu items</li>
                      <li>• <code>/content/settings/</code> - Site settings</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-12 backdrop-blur-sm bg-white/5 border border-white/20 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Getting Started with TinaCMS</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-orange-300 mb-4">🚀 Quick Start</h3>
                  <ol className="text-white/80 space-y-2 text-sm">
                    <li>1. Click "TinaCMS Editor" above to open the admin interface</li>
                    <li>2. Navigate to "Pages" to edit existing content</li>
                    <li>3. Use the rich text editor to make changes</li>
                    <li>4. Save your changes to see them live</li>
                  </ol>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-blue-300 mb-4">✨ Features</h3>
                  <ul className="text-white/80 space-y-2 text-sm">
                    <li>• Visual content editing</li>
                    <li>• Media management</li>
                    <li>• Live preview</li>
                    <li>• Version control integration</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="mt-8 text-center">
              <div className="inline-flex items-center space-x-2 backdrop-blur-sm bg-green-500/20 border border-green-500/30 rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-300 text-sm font-medium">
                  TinaCMS is running on localhost:4001
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
