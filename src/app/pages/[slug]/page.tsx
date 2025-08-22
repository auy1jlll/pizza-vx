import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import client from '../../../../tina/__generated__/client';
import { TinaMarkdown } from 'tinacms/dist/rich-text';

type PageProps = {
  params: { slug: string };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const page = await client.queries.page({ relativePath: `${resolvedParams.slug}.md` });
    
    if (!page?.data?.page) {
      return {
        title: 'Page Not Found',
      };
    }

    return {
      title: page.data.page.title,
      description: page.data.page.description || '',
    };
  } catch (error) {
    return {
      title: 'Page Not Found',
    };
  }
}

export default async function Page({ params }: PageProps) {
  try {
    const resolvedParams = await params;
    const page = await client.queries.page({ relativePath: `${resolvedParams.slug}.md` });
    
    if (!page?.data?.page || !page.data.page.published) {
      notFound();
    }

    const { title, body } = page.data.page;

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Glass morphism container */}
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 md:p-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 text-center">
                {title}
              </h1>
              
              <div className="prose prose-lg prose-invert max-w-none">
                <div className="text-white/90 leading-relaxed">
                  <TinaMarkdown content={body} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading page:', error);
    notFound();
  }
}
