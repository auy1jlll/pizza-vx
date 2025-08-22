import { loadContent } from '@/lib/content-loader';
import ContentPageComponent from '@/components/ContentPageComponent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ | Boston Pizza House - Frequently Asked Questions',
  description: 'Find answers to common questions about ordering, delivery, menu items, and dining at Boston Pizza House. Quick answers to help you.',
  keywords: 'faq, frequently asked questions, boston pizza house help, delivery questions, menu questions, ordering help',
};

export default async function FAQPage() {
  const content = await loadContent('faq');

  return <ContentPageComponent content={content} pageType="faq" />;
}
