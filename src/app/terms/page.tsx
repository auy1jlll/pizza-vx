import { loadContent } from '@/lib/content-loader';
import ContentPageComponent from '@/components/ContentPageComponent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Boston Pizza House',
  description: 'Read our terms and conditions for ordering from Boston Pizza House. Information about delivery, payment, cancellations, and service policies.',
  keywords: 'terms conditions, boston pizza house policies, delivery terms, order cancellation, payment terms',
};

export default async function TermsPage() {
  const content = await loadContent('terms-conditions');

  return <ContentPageComponent content={content} pageType="terms" />;
}
