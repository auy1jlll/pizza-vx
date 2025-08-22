import { loadContent } from '@/lib/content-loader';
import ContentPageComponent from '@/components/ContentPageComponent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Boston Pizza House - Authentic Italian Since 1985',
  description: 'Learn about Boston Pizza House, serving authentic wood-fired pizzas since 1985. Family recipes, fresh ingredients, and traditional Italian cooking in Boston\'s North End.',
  keywords: 'about boston pizza house, authentic italian pizza, wood fired pizza boston, family recipes, north end restaurant',
};

export default async function AboutPage() {
  const content = await loadContent('about-us');

  return <ContentPageComponent content={content} pageType="about" />;
}
