'use client';

import { useState, useEffect, useMemo } from 'react';
import { Bold, Italic, List, Link, Image, Search, Target, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { SEOContentAssistant } from '@/lib/seo-assistant';

interface SEOEditorProps {
  value: string;
  onChange: (value: string) => void;
  title: string;
  metaDescription: string;
  placeholder?: string;
  showSEOPanel?: boolean;
}

export default function SEOEditor({ 
  value, 
  onChange, 
  title, 
  metaDescription, 
  placeholder,
  showSEOPanel = true 
}: SEOEditorProps) {
  const [isPreview, setIsPreview] = useState(false);
  const [seoExpanded, setSeoExpanded] = useState(true);
  
  const seoAssistant = useMemo(() => new SEOContentAssistant(), []);
  
  // Real-time SEO analysis
  const seoAnalysis = useMemo(() => {
    if (!value || !title) return null;
    return seoAssistant.analyzeRealTime(value, title, metaDescription);
  }, [value, title, metaDescription, seoAssistant]);

  const insertFormatting = (before: string, after: string = '') => {
    const textarea = document.getElementById('seo-content-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newValue = value.substring(0, start) + before + selectedText + after + value.substring(end);
    onChange(newValue);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 10);
  };

  const toolbarButtons = [
    { icon: Bold, action: () => insertFormatting('**', '**'), label: 'Bold' },
    { icon: Italic, action: () => insertFormatting('*', '*'), label: 'Italic' },
    { icon: List, action: () => insertFormatting('\n- ', ''), label: 'List' },
    { icon: Link, action: () => insertFormatting('[', '](url)'), label: 'Link' },
    { icon: Image, action: () => insertFormatting('![alt text](', ')'), label: 'Image' },
  ];

  const convertMarkdownToHTML = (markdown: string) => {
    return markdown
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-400 hover:text-blue-300">$1</a>')
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg" />')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(.+)$/gm, '<p>$1</p>')
      .replace(/<p><\/p>/g, '');
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getKeywordStatusIcon = (status: 'missing' | 'good' | 'overused') => {
    switch (status) {
      case 'good': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'missing': return <AlertCircle className="w-4 h-4 text-red-400" />;
      case 'overused': return <AlertCircle className="w-4 h-4 text-yellow-400" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Editor */}
      <div className="border border-white/20 rounded-xl overflow-hidden bg-white/5 backdrop-blur-sm">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
          <div className="flex items-center space-x-2">
            {toolbarButtons.map((button, index) => (
              <button
                key={index}
                type="button"
                onClick={button.action}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title={button.label}
              >
                <button.icon className="w-4 h-4" />
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-2">
            {seoAnalysis && (
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-white/5 rounded-lg">
                <Search className="w-4 h-4 text-white/70" />
                <span className="text-sm text-white/70">SEO Score:</span>
                <span className={`text-sm font-bold ${getScoreColor(seoAnalysis.score)}`}>
                  {seoAnalysis.score}/100
                </span>
              </div>
            )}
            <button
              type="button"
              onClick={() => setIsPreview(!isPreview)}
              className="px-3 py-1.5 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              {isPreview ? 'Edit' : 'Preview'}
            </button>
          </div>
        </div>

        {/* Editor/Preview */}
        <div className="min-h-[400px]">
          {isPreview ? (
            <div 
              className="p-6 prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: convertMarkdownToHTML(value) || '<p class="text-white/50">Nothing to preview yet...</p>' 
              }}
            />
          ) : (
            <textarea
              id="seo-content-editor"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder || 'Start writing your SEO-optimized content...'}
              className="w-full h-[400px] p-6 bg-transparent text-white placeholder-white/50 border-0 resize-none focus:outline-none"
            />
          )}
        </div>

        {/* Help Text */}
        <div className="px-4 py-2 text-xs text-white/50 bg-white/5 border-t border-white/10">
          Tip: Use **bold**, *italic*, - lists, [links](url), and ![images](url) for formatting
        </div>
      </div>

      {/* SEO Assistant Panel */}
      {showSEOPanel && seoAnalysis && (
        <div className="border border-white/20 rounded-xl overflow-hidden bg-white/5 backdrop-blur-sm">
          <div 
            className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5 cursor-pointer"
            onClick={() => setSeoExpanded(!seoExpanded)}
          >
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              <h3 className="text-white font-medium">SEO Assistant</h3>
              <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                seoAnalysis.score >= 80 ? 'bg-green-500/20 text-green-400' :
                seoAnalysis.score >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {seoAnalysis.score}/100
              </div>
            </div>
            <button className="text-white/70 hover:text-white">
              {seoExpanded ? '−' : '+'}
            </button>
          </div>

          {seoExpanded && (
            <div className="p-4 space-y-4">
              {/* Quick Suggestions */}
              {seoAnalysis.topSuggestions.length > 0 && (
                <div>
                  <h4 className="text-white font-medium mb-2 flex items-center">
                    <Target className="w-4 h-4 mr-2 text-orange-400" />
                    Top Suggestions
                  </h4>
                  <div className="space-y-2">
                    {seoAnalysis.topSuggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-start space-x-2 p-2 bg-white/5 rounded-lg">
                        <AlertCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-white/80">{suggestion}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Keyword Status */}
              <div>
                <h4 className="text-white font-medium mb-2 flex items-center">
                  <Search className="w-4 h-4 mr-2 text-blue-400" />
                  Keyword Status
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {Object.entries(seoAnalysis.keywordStatus).map(([keyword, status]) => (
                    <div key={keyword} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                      <span className="text-sm text-white/80 truncate">{keyword}</span>
                      <div className="flex items-center space-x-1">
                        {getKeywordStatusIcon(status)}
                        <span className={`text-xs capitalize ${
                          status === 'good' ? 'text-green-400' :
                          status === 'missing' ? 'text-red-400' :
                          'text-yellow-400'
                        }`}>
                          {status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h4 className="text-white font-medium mb-2">Quick Actions</h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => insertFormatting('\n\n### Why Choose RestoApp in Greenland, NH?\n\n')}
                    className="px-3 py-1.5 text-xs bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors"
                  >
                    Add Local Section
                  </button>
                  <button
                    onClick={() => insertFormatting('\n\n**Better than Nick & Charlie Pizza** - ')}
                    className="px-3 py-1.5 text-xs bg-orange-500/20 text-orange-400 rounded-lg hover:bg-orange-500/30 transition-colors"
                  >
                    Add Competitive Edge
                  </button>
                  <button
                    onClick={() => insertFormatting('\n\n*"Best pizza in Greenland, NH!"* - Customer Review\n\n')}
                    className="px-3 py-1.5 text-xs bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                  >
                    Add Testimonial
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
