import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

const prisma = new PrismaClient();

// Markdown to HTML converter
const convertMarkdownToHTML = (markdown: string) => {
  let html = markdown
    .replace(/^### (.*$)/gim, '<h3 class="text-2xl font-bold text-gray-900 mb-4 mt-8">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-3xl font-bold text-gray-900 mb-6 mt-10">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-4xl font-bold text-gray-900 mb-8 mt-12">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-900 font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="text-gray-700 italic">$1</em>')
    .replace(/^- (.*$)/gim, '<li class="text-gray-800 mb-2 leading-relaxed">$1</li>')
    .replace(/\n\n+/g, '\n</p>\n<p class="text-gray-800 leading-relaxed mb-6">\n');
  
  // Wrap list items in ul tags
  html = html.replace(/(<li[^>]*>.*?<\/li>)/g, (match) => {
    return match;
  });
  
  // Add opening paragraph tag if content doesn't start with a tag
  if (!html.startsWith('<')) {
    html = '<p class="text-gray-800 leading-relaxed mb-6">' + html;
  }
  
  // Add closing paragraph tag if content doesn't end with a tag
  if (!html.endsWith('>')) {
    html = html + '</p>';
  }
  
  return html;
};

interface PageProps {
  params: {
    slug: string[];
  };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug.join('/');
  
  try {
    const page = await (prisma as any).dynamicPage.findUnique({
      where: {
        slug,
        status: 'PUBLISHED'
      }
    });

    if (!page) {
      return {
        title: 'Page Not Found',
        description: 'The requested page could not be found.'
      };
    }

    return {
      title: page.metaTitle || page.title,
      description: page.metaDescription || '',
      keywords: page.metaKeywords || '',
      openGraph: {
        title: page.metaTitle || page.title,
        description: page.metaDescription || '',
        type: 'website',
        url: `https://yourrestaurant.com/${page.slug}`,
        images: page.ogImage ? [page.ogImage] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: page.metaTitle || page.title,
        description: page.metaDescription || '',
        images: page.ogImage ? [page.ogImage] : undefined,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Error Loading Page',
      description: 'An error occurred while loading the page.'
    };
  }
}

// This will handle all dynamic pages at /[...slug]
export default async function DynamicPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug.join('/');

  try {
    const page = await (prisma as any).dynamicPage.findUnique({
      where: {
        slug,
        status: 'PUBLISHED'
      },
      include: {
        author: {
          select: { name: true }
        }
      }
    });

    if (!page) {
      console.log(`Page not found for slug: ${slug}`);
      notFound();
    }

    return (
      <>
        {/* SEO-Optimized High Contrast Layout */}
        <div className="min-h-screen bg-white">
          {/* Hero Section with Brand Colors */}
          <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight leading-tight">
                  {page.title}
                </h1>
                {page.excerpt && (
                  <p className="text-xl text-white/95 max-w-2xl mx-auto leading-relaxed">
                    {page.excerpt}
                  </p>
                )}
                
                {/* Meta info */}
                <div className="flex items-center justify-center space-x-4 mt-8 text-white/80">
                  {page.author && (
                    <span className="text-sm">By {page.author.name}</span>
                  )}
                  {page.publishedAt && (
                    <span className="text-sm">
                      Published {new Date(page.publishedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - High Contrast White Background */}
          <main className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto">
              <article className="bg-white shadow-xl border border-gray-200 rounded-2xl p-8 md:p-12">
                <div 
                  className="prose prose-xl prose-gray max-w-none 
                           prose-headings:text-gray-900 prose-headings:font-bold
                           prose-p:text-gray-800 prose-p:leading-relaxed prose-p:mb-6
                           prose-strong:text-gray-900 prose-strong:font-semibold
                           prose-ul:text-gray-800 prose-ol:text-gray-800
                           prose-li:text-gray-800 prose-li:leading-relaxed prose-li:mb-2
                           prose-a:text-red-600 prose-a:font-medium hover:prose-a:text-red-700
                           prose-blockquote:border-red-500 prose-blockquote:text-gray-700
                           prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
                           prose-h1:mb-8 prose-h2:mb-6 prose-h3:mb-4 prose-h4:mb-3
                           prose-ul:mb-6 prose-ol:mb-6 prose-table:mb-6"
                  dangerouslySetInnerHTML={{ __html: page.content }}
                />
              </article>
            </div>
          </main>
          
          {/* Structured Data Script */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ 
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebPage",
                "name": page.metaTitle || page.title,
                "description": page.metaDescription,
                "url": `https://yourrestaurant.com/${page.slug}`,
                "author": page.author ? {
                  "@type": "Person",
                  "name": page.author.name
                } : undefined,
                "datePublished": page.publishedAt?.toISOString(),
                "dateModified": page.updatedAt.toISOString()
              })
            }}
          />
        </div>
      </>
    );
  } catch (error) {
    console.error('Error loading page:', error);
    notFound();
  }
}
