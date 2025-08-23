import { loadContent } from '@/lib/content-loader';
import ContentPageComponent from '@/components/ContentPageComponent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Local Pizza House - Authentic Italian Since 1985',
  description: 'Learn about Local Pizza House, serving authentic 650 degree oven pizzas since 1985. Family recipes, fresh ingredients, and traditional Italian cooking.',
  keywords: 'about local pizza house, authentic italian pizza, 650 degree oven pizza, family recipes, local restaurant',
};

export default async function AboutPage() {
  const content = await loadContent('about-us');

  return <ContentPageComponent content={content} pageType="about" />;
}
