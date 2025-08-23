import { loadContent } from '@/lib/content-loader';
import ContentPageComponent from '@/components/ContentPageComponent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Local Pizza House',
  description: 'Learn how Local Pizza House protects your privacy and handles your personal information. Our commitment to data security and customer privacy.',
  keywords: 'privacy policy, data protection, personal information, local pizza house privacy, customer data security',
};

export default async function PrivacyPage() {
  const content = await loadContent('privacy-policy');

  return <ContentPageComponent content={content} pageType="privacy" />;
}
