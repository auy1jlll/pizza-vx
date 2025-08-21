'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, Globe, Clock, User, Search, Filter } from 'lucide-react';
import { designSystem, components, animations, responsive } from '../../../lib/design-system';
import AdminNavigation from '../../../components/AdminNavigation';

interface DynamicPage {
  id: string;
  title: string;
  slug: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  excerpt?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  author?: {
    id: string;
    name: string;
    email: string;
  };
}

export default function AdminPagesPage() {
  const [pages, setPages] = useState<DynamicPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const response = await fetch('/api/admin/pages');
      const result = await response.json();
      if (result.success) {
        setPages(result.data);
      }
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const deletePage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return;

    try {
      const response = await fetch(`/api/admin/pages/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.success) {
        setPages(pages.filter(page => page.id !== id));
      }
    } catch (error) {
      console.error('Error deleting page:', error);
    }
  };

  const filteredPages = pages.filter(page => {
    const matchesSearch = page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         page.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || page.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'DRAFT': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'ARCHIVED': return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Admin Navigation */}
      <AdminNavigation />
      
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className={`${responsive.text.hero} font-bold text-white mb-2`}>
                Page Management
              </h1>
              <p className={`${responsive.text.body} text-white/70`}>
                Create and manage SEO-optimized pages for your restaurant
              </p>
            </div>
            
            <Link
              href="/admin/pages/new"
              className={`${components.button.primary} px-6 py-3 mt-4 md:mt-0 inline-flex items-center space-x-2`}
            >
              <Plus className="w-5 h-5" />
              <span>Create New Page</span>
            </Link>
          </div>

          {/* Search and Filters */}
          <div className={`${components.card.glass} p-6 mb-6`}>
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="text"
                  placeholder="Search pages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`${components.input.glass} pl-10`}
                />
              </div>

              {/* Status Filter */}
              <div className="md:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={`${components.input.glass}`}
                >
                  <option value="all">All Status</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="DRAFT">Draft</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Pages Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <div className={`${responsive.grid.tablet}`}>
            {filteredPages.map((page, index) => (
              <div
                key={page.id}
                className={`${components.card.interactive} p-6 ${animations.fadeIn}`}
                style={animations.staggered(index)}
              >
                {/* Page Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className={`${designSystem.h3} text-white mb-2 truncate`}>
                      {page.title}
                    </h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <Globe className="w-4 h-4 text-white/50" />
                      <span className={`${designSystem.small} text-white/70 truncate`}>
                        /{page.slug}
                      </span>
                    </div>
                  </div>
                  
                  <div className={`${designSystem.tiny} inline-flex items-center px-3 py-1 rounded-full border ${getStatusColor(page.status)}`}>
                    {page.status}
                  </div>
                </div>

                {/* Excerpt */}
                {page.excerpt && (
                  <p className={`${designSystem.small} text-white/60 mb-4 line-clamp-2`}>
                    {page.excerpt}
                  </p>
                )}

                {/* Meta Info */}
                <div className="flex items-center justify-between text-white/50 mb-6">
                  <div className="flex items-center space-x-4">
                    {page.author && (
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span className={`${designSystem.tiny}`}>{page.author.name}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span className={`${designSystem.tiny}`}>
                        {new Date(page.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-3">
                  {page.status === 'PUBLISHED' && (
                    <a
                      href={`/${page.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${components.badge.secondary} text-xs`}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </a>
                  )}
                  
                  <Link
                    href={`/admin/pages/${page.id}/edit`}
                    className={`${components.badge.primary} text-xs`}
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Link>
                  
                  <button
                    onClick={() => deletePage(page.id)}
                    className={`${components.badge.neutral} text-xs hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-300 transition-colors`}
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {filteredPages.length === 0 && !loading && (
              <div className="col-span-full text-center py-20">
                <div className={`${components.card.glass} p-12 max-w-md mx-auto`}>
                  <Globe className="w-16 h-16 text-white/30 mx-auto mb-4" />
                  <h3 className={`${designSystem.h3} text-white mb-2`}>No Pages Found</h3>
                  <p className={`${designSystem.body} text-white/60 mb-6`}>
                    {searchTerm || statusFilter !== 'all' 
                      ? 'No pages match your current filters.' 
                      : 'Get started by creating your first page.'}
                  </p>
                  <Link
                    href="/admin/pages/new"
                    className={`${components.button.primary} px-6 py-3 inline-flex items-center space-x-2`}
                  >
                    <Plus className="w-5 h-5" />
                    <span>Create New Page</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
