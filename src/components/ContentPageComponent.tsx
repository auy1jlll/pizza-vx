'use client';

import { ContentPage } from '@/lib/content-loader';
import { Clock, Mail, Phone, MapPin } from 'lucide-react';

interface ContentPageComponentProps {
  content: ContentPage;
  pageType?: 'about' | 'terms' | 'privacy' | 'faq' | 'contact' | 'generic';
}

export default function ContentPageComponent({ content, pageType = 'generic' }: ContentPageComponentProps) {
  const renderSection = (section: any, index: number) => {
    switch (pageType) {
      case 'about':
        return renderAboutSection(section, index);
      case 'terms':
      case 'privacy':
        return renderLegalSection(section, index);
      case 'faq':
        return renderFAQSection(section, index);
      case 'contact':
        return renderContactSection(section, index);
      default:
        return renderGenericSection(section, index);
    }
  };

  const renderAboutSection = (section: any, index: number) => (
    <section key={section.id || index} className="mb-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">{section.title}</h2>
      
      {section.content && (
        <div className="space-y-4 mb-6">
          {section.content.map((paragraph: string, i: number) => (
            <p key={i} className="text-gray-600 text-lg leading-relaxed">{paragraph}</p>
          ))}
        </div>
      )}

      {section.items && (
        <div className="grid md:grid-cols-2 gap-6">
          {section.items.map((item: any, i: number) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-md">
              {item.title && <h3 className="text-xl font-semibold text-gray-800 mb-3">{item.title}</h3>}
              {item.description && <p className="text-gray-600">{item.description}</p>}
              {typeof item === 'string' && <p className="text-gray-600">{item}</p>}
            </div>
          ))}
        </div>
      )}

      {section.members && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {section.members.map((member: any, i: number) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{member.name}</h3>
              <p className="text-green-600 font-medium mb-3">{member.role}</p>
              <p className="text-gray-600 text-sm">{member.bio}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );

  const renderLegalSection = (section: any, index: number) => (
    <section key={section.id || index} className="mb-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{section.title}</h2>
      
      {section.content && (
        <div className="space-y-3 mb-6">
          {section.content.map((paragraph: string, i: number) => (
            <p key={i} className="text-gray-600 leading-relaxed">{paragraph}</p>
          ))}
        </div>
      )}

      {section.subsections && (
        <div className="space-y-6">
          {section.subsections.map((subsection: any, i: number) => (
            <div key={i} className="ml-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">{subsection.title}</h3>
              <p className="text-gray-600 leading-relaxed">{subsection.content}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );

  const renderFAQSection = (section: any, index: number) => (
    <section key={section.id || index} className="mb-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{section.title}</h2>
      <div className="space-y-4">
        {section.questions.map((qa: any, i: number) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">{qa.question}</h3>
            <p className="text-gray-600 leading-relaxed">{qa.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );

  const renderContactSection = (section: any, index: number) => {
    // Special handling for contact page
    if (section.restaurant) {
      return (
        <div key={index} className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <MapPin className="w-6 h-6 mr-2 text-green-600" />
              Location & Hours
            </h2>
            <div className="space-y-3">
              <p className="text-gray-600">{section.restaurant.address.formatted}</p>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-green-600" />
                <span className="text-gray-600">{section.restaurant.contact.phone}</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-green-600" />
                <span className="text-gray-600">{section.restaurant.contact.email}</span>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Clock className="w-4 h-4 mr-2 text-green-600" />
                Hours
              </h3>
              <div className="space-y-1 text-sm text-gray-600">
                {Object.entries(section.restaurant.hours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between">
                    <span className="capitalize font-medium">{day}:</span>
                    <span>{String(hours)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Contact</h2>
            <div className="space-y-4">
              {Object.entries(section.quickContact || {}).map(([key, contact]: [string, any]) => (
                <div key={key} className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-800">{contact.title}</h3>
                  {contact.phone && <p className="text-gray-600">{contact.phone}</p>}
                  {contact.online && <p className="text-gray-600">{contact.online}</p>}
                  {contact.note && <p className="text-sm text-gray-500 italic">{contact.note}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderGenericSection = (section: any, index: number) => (
    <section key={section.id || index} className="mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{section.title}</h2>
      {section.content && (
        <div className="space-y-3">
          {section.content.map((paragraph: string, i: number) => (
            <p key={i} className="text-gray-600 leading-relaxed">{paragraph}</p>
          ))}
        </div>
      )}
    </section>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{content.page.title}</h1>
          {content.page.subtitle && (
            <p className="text-xl md:text-2xl text-green-100">{content.page.subtitle}</p>
          )}
          {content.page.lastUpdated && (
            <p className="text-sm text-green-200 mt-4">
              Last Updated: {new Date(content.page.lastUpdated).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {pageType === 'contact' && content.restaurant && (
          renderContactSection({ restaurant: content.restaurant, quickContact: content.quickContact }, 0)
        )}
        
        {pageType === 'faq' && content.categories && (
          <div>
            {content.categories.map((category: any, index: number) => renderFAQSection(category, index))}
            
            {content.contactInfo && (
              <div className="bg-green-50 p-8 rounded-lg text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{content.contactInfo.stillHaveQuestions}</h2>
                <p className="text-gray-600 mb-4">{content.contactInfo.contactText}</p>
                <div className="flex justify-center space-x-6">
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 mr-2 text-green-600" />
                    <span className="text-gray-700">{content.contactInfo.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 mr-2 text-green-600" />
                    <span className="text-gray-700">{content.contactInfo.email}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {(pageType === 'about' || pageType === 'terms' || pageType === 'privacy' || pageType === 'generic') && 
         content.sections && (
          <div>
            {content.sections.map((section: any, index: number) => renderSection(section, index))}
          </div>
        )}

        {pageType === 'about' && content.contactInfo && (
          <div className="bg-green-50 p-8 rounded-lg mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Visit Us Today!</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-green-600" />
                  Address
                </h3>
                <p className="text-gray-600">{content.contactInfo.address}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-green-600" />
                  Phone
                </h3>
                <p className="text-gray-600">{content.contactInfo.phone}</p>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Clock className="w-4 h-4 mr-2 text-green-600" />
                Hours
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                {Object.entries(content.contactInfo.hours).map(([day, hours]) => (
                  <div key={day} className="text-center">
                    <div className="font-medium text-gray-800 capitalize">{day}</div>
                    <div className="text-gray-600">{String(hours)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
