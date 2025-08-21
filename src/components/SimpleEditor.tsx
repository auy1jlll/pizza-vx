'use client';

import { useState } from 'react';
import { Bold, Italic, List, Link, Image, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface SimpleEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SimpleEditor({ value, onChange, placeholder }: SimpleEditorProps) {
  const [isPreview, setIsPreview] = useState(false);

  const insertFormatting = (before: string, after: string = '') => {
    const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newValue = value.substring(0, start) + before + selectedText + after + value.substring(end);
    onChange(newValue);
    
    // Set cursor position after formatting
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

  return (
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
            id="content-editor"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || 'Start writing your content...'}
            className="w-full h-[400px] p-6 bg-transparent text-white placeholder-white/50 border-0 resize-none focus:outline-none"
          />
        )}
      </div>

      {/* Help Text */}
      <div className="px-4 py-2 text-xs text-white/50 bg-white/5 border-t border-white/10">
        Tip: Use **bold**, *italic*, - lists, [links](url), and ![images](url) for formatting
      </div>
    </div>
  );
}
