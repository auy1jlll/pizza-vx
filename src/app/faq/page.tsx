import { loadContent } from '@/lib/content-loader';
import ContentPageComponent from '@/components/ContentPageComponent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ | Local Pizza House - Frequently Asked Questions',
  description: 'Find answers to common questions about ordering, pickup, menu items, and dining at Local Pizza House. Quick answers to help you.',
  keywords: 'faq, frequently asked questions, local pizza house help, pickup questions, menu questions, ordering help',
};

export default async function FAQPage() {
  const content = await loadContent('faq');

  return <ContentPageComponent content={content} pageType="faq" />;
}
