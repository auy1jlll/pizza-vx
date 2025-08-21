'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, Eye, Trash2, Search, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import { designSystem, components, animations, responsive } from '../../../../../lib/design-system';
import SimpleEditor from '../../../../../components/SimpleEditor';

const pageSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be under 100 characters'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().max(300, 'Excerpt must be under 300 characters').optional(),
  metaTitle: z.string().max(60, 'Meta title should be under 60 characters').optional(),
  metaDescription: z.string().max(160, 'Meta description should be under 160 characters').optional(),
  metaKeywords: z.string().optional(),
  ogImage: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  template: z.string().optional()
});

type PageFormData = z.infer<typeof pageSchema>;

interface EditPagePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditPagePage({ params }: EditPagePageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [content, setContent] = useState('');
  const [previewMode, setPreviewMode] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm<PageFormData>({
    resolver: zodResolver(pageSchema)
  });

  const watchedTitle = watch('title') || '';
  const watchedMetaTitle = watch('metaTitle') || '';
  const watchedMetaDescription = watch('metaDescription') || '';

  useEffect(() => {
    loadPage();
  }, [resolvedParams.id]);

  const loadPage = async () => {
    try {
      const response = await fetch(`/api/admin/pages/${resolvedParams.id}`);
      const result = await response.json();
      
      if (result.success) {
        const page = result.data;
        reset({
          title: page.title,
          excerpt: page.excerpt || '',
          metaTitle: page.metaTitle || '',
          metaDescription: page.metaDescription || '',
          metaKeywords: page.metaKeywords || '',
          ogImage: page.ogImage || '',
          status: page.status,
          template: page.template
        });
        setContent(page.content);
      } else {
        console.error('Error loading page:', result.error);
      }
    } catch (error) {
      console.error('Error loading page:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: PageFormData) => {
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/pages/${resolvedParams.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          content
        }),
      });

      const result = await response.json();
      if (result.success) {
        router.push('/admin/pages');
      } else {
        console.error('Error updating page:', result.error);
      }
    } catch (error) {
      console.error('Error updating page:', error);
    } finally {
      setSaving(false);
    }
  };

  const deletePage = async () => {
    if (!confirm('Are you sure you want to delete this page? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/pages/${resolvedParams.id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      if (result.success) {
        router.push('/admin/pages');
      } else {
        console.error('Error deleting page:', result.error);
      }
    } catch (error) {
      console.error('Error deleting page:', error);
    } finally {
      setDeleting(false);
    }
  };

  const generateSEOSuggestions = () => {
    const title = watchedTitle;
    return {
      metaTitle: title ? `${title} | Boston Restaurant` : '',
      metaDescription: title ? `Discover ${title.toLowerCase()} at Boston's favorite restaurant. Fresh ingredients, authentic flavors, and exceptional dining experience.` : '',
      keywords: title ? `${title.toLowerCase()}, boston restaurant, fresh food, dining` : ''
    };
  };

  const applySEOSuggestions = () => {
    const suggestions = generateSEOSuggestions();
    setValue('metaTitle', suggestions.metaTitle);
    setValue('metaDescription', suggestions.metaDescription);
    setValue('metaKeywords', suggestions.keywords);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link
                  href="/admin/pages"
                  className={`${components.button.glass} p-2`}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                  <h1 className={`${designSystem.h2} text-white`}>Edit Page</h1>
                  <p className={`${designSystem.small} text-white/70`}>
                    Update your SEO-optimized content
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setPreviewMode(!previewMode)}
                  className={`${components.button.secondary} px-4 py-2 text-sm`}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {previewMode ? 'Edit' : 'Preview'}
                </button>

                <button
                  onClick={deletePage}
                  disabled={deleting}
                  className={`${components.button.glass} px-4 py-2 text-sm hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-300 transition-colors`}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
                
                <button
                  onClick={handleSubmit(onSubmit)}
                  disabled={saving}
                  className={`${components.button.primary} px-6 py-2 text-sm`}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Title */}
                <div className={`${components.card.glass} p-6`}>
                  <label className={`${designSystem.body} text-white font-medium mb-3 block`}>
                    Page Title *
                  </label>
                  <input
                    type="text"
                    {...register('title')}
                    className={`${components.input.glass} text-xl font-bold`}
                    placeholder="Enter your page title..."
                  />
                  {errors.title && (
                    <p className="text-red-400 text-sm mt-2">{errors.title.message}</p>
                  )}
                </div>

                {/* Content Editor */}
                <div className={`${components.card.glass} p-6`}>
                  <label className={`${designSystem.body} text-white font-medium mb-3 block`}>
                    Page Content *
                  </label>
                  
                  {previewMode ? (
                    <div 
                      className="prose prose-invert max-w-none bg-white/5 rounded-xl p-6 min-h-[400px]"
                      dangerouslySetInnerHTML={{ __html: content || '<p>No content yet...</p>' }}
                    />
                  ) : (
                    <SimpleEditor
                      value={content}
                      onChange={setContent}
                      placeholder="Start writing your page content..."
                    />
                  )}
                </div>

                {/* Excerpt */}
                <div className={`${components.card.glass} p-6`}>
                  <label className={`${designSystem.body} text-white font-medium mb-3 block`}>
                    Page Excerpt
                  </label>
                  <textarea
                    {...register('excerpt')}
                    rows={3}
                    className={`${components.input.glass} resize-none`}
                    placeholder="Brief description of this page..."
                  />
                  {errors.excerpt && (
                    <p className="text-red-400 text-sm mt-2">{errors.excerpt.message}</p>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Publishing Options */}
                <div className={`${components.card.glass} p-6`}>
                  <h3 className={`${designSystem.h3} text-white mb-4`}>Publishing</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className={`${designSystem.small} text-white/80 mb-2 block`}>
                        Status
                      </label>
                      <select
                        {...register('status')}
                        className={`${components.input.glass}`}
                      >
                        <option value="DRAFT">Draft</option>
                        <option value="PUBLISHED">Published</option>
                        <option value="ARCHIVED">Archived</option>
                      </select>
                    </div>

                    <div>
                      <label className={`${designSystem.small} text-white/80 mb-2 block`}>
                        Template
                      </label>
                      <select
                        {...register('template')}
                        className={`${components.input.glass}`}
                      >
                        <option value="default">Default</option>
                        <option value="landing">Landing Page</option>
                        <option value="blog">Blog Post</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* SEO Settings */}
                <div className={`${components.card.glass} p-6`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`${designSystem.h3} text-white`}>SEO Settings</h3>
                    <button
                      type="button"
                      onClick={applySEOSuggestions}
                      className={`${components.badge.primary} text-xs`}
                    >
                      <Lightbulb className="w-3 h-3 mr-1" />
                      Auto-fill
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className={`${designSystem.small} text-white/80 mb-2 block`}>
                        Meta Title ({watchedMetaTitle.length}/60)
                      </label>
                      <input
                        type="text"
                        {...register('metaTitle')}
                        className={`${components.input.glass}`}
                        placeholder="SEO title for search engines..."
                      />
                      {errors.metaTitle && (
                        <p className="text-red-400 text-xs mt-1">{errors.metaTitle.message}</p>
                      )}
                    </div>

                    <div>
                      <label className={`${designSystem.small} text-white/80 mb-2 block`}>
                        Meta Description ({watchedMetaDescription.length}/160)
                      </label>
                      <textarea
                        {...register('metaDescription')}
                        rows={3}
                        className={`${components.input.glass} resize-none`}
                        placeholder="Description for search engine results..."
                      />
                      {errors.metaDescription && (
                        <p className="text-red-400 text-xs mt-1">{errors.metaDescription.message}</p>
                      )}
                    </div>

                    <div>
                      <label className={`${designSystem.small} text-white/80 mb-2 block`}>
                        Keywords
                      </label>
                      <input
                        type="text"
                        {...register('metaKeywords')}
                        className={`${components.input.glass}`}
                        placeholder="keyword1, keyword2, keyword3..."
                      />
                    </div>

                    <div>
                      <label className={`${designSystem.small} text-white/80 mb-2 block`}>
                        Social Image URL
                      </label>
                      <input
                        type="url"
                        {...register('ogImage')}
                        className={`${components.input.glass}`}
                        placeholder="https://example.com/image.jpg"
                      />
                      {errors.ogImage && (
                        <p className="text-red-400 text-xs mt-1">{errors.ogImage.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* SEO Preview */}
                <div className={`${components.card.glass} p-6`}>
                  <h3 className={`${designSystem.h3} text-white mb-4 flex items-center`}>
                    <Search className="w-5 h-5 mr-2" />
                    Google Preview
                  </h3>
                  
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-blue-600 text-lg hover:underline cursor-pointer mb-1">
                      {watchedMetaTitle || watchedTitle || 'Your Page Title'}
                    </div>
                    <div className="text-green-700 text-sm mb-2">
                      https://yourrestaurant.com/{watchedTitle ? watchedTitle.toLowerCase().replace(/\s+/g, '-') : 'page-url'}
                    </div>
                    <div className="text-gray-700 text-sm">
                      {watchedMetaDescription || 'Your meta description will appear here. Make it compelling to encourage clicks from search results.'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
