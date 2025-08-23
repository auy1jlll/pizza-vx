import { loadContent } from '@/lib/content-loader';
import ContentPageComponent from '@/components/ContentPageComponent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Local Pizza House',
  description: 'Read our terms and conditions for ordering from Local Pizza House. Information about pickup, payment, cancellations, and service policies.',
  keywords: 'terms conditions, local pizza house policies, pickup terms, order cancellation, payment terms',
};

export default async function TermsPage() {
  const content = await loadContent('terms-conditions');

  return <ContentPageComponent content={content} pageType="terms" />;
}
