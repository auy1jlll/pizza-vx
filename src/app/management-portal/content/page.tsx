'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { Edit, Eye, Save, X, FileText, Clock, AlertCircle } from 'lucide-react';

interface ContentFile {
  name: string;
  title: string;
  lastUpdated: string;
  size: number;
}

export default function ContentManagementPage() {
  const [contentFiles, setContentFiles] = useState<ContentFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchContentFiles();
  }, []);

  const showMessage = (message: string, type: 'success' | 'error') => {
    if (type === 'success') {
      setSuccess(message);
      setError(null);
      setTimeout(() => setSuccess(null), 3000);
    } else {
      setError(message);
      setSuccess(null);
      setTimeout(() => setError(null), 5000);
    }
  };

  const fetchContentFiles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/content');
      const result = await response.json();
      
      if (result.success) {
        setContentFiles(result.data.files);
      } else {
        showMessage('Failed to load content files', 'error');
      }
    } catch (error) {
      console.error('Error fetching content files:', error);
      showMessage('Error loading content files', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadFileContent = async (filename: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/content/${filename}`);
      const result = await response.json();
      
      if (result.success) {
        setFileContent(JSON.stringify(result.data, null, 2));
        setSelectedFile(filename);
        setIsEditing(false);
      } else {
        showMessage('Failed to load file content', 'error');
      }
    } catch (error) {
      console.error('Error loading file content:', error);
      showMessage('Error loading file content', 'error');
    } finally {
      setLoading(false);
    }
  };

  const saveFileContent = async () => {
    if (!selectedFile) return;

    try {
      setSaving(true);
      
      // Validate JSON
      const parsedContent = JSON.parse(fileContent);
      
      const response = await fetch(`/api/admin/content/${selectedFile}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: parsedContent })
      });

      const result = await response.json();
      
      if (result.success) {
        showMessage('Content saved successfully!', 'success');
        setIsEditing(false);
        fetchContentFiles(); // Refresh file list
      } else {
        showMessage('Failed to save content: ' + result.error, 'error');
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        showMessage('Invalid JSON format. Please check your syntax.', 'error');
      } else {
        console.error('Error saving content:', error);
        showMessage('Error saving content', 'error');
      }
    } finally {
      setSaving(false);
    }
  };

  const previewPage = (filename: string) => {
    const pageMap: { [key: string]: string } = {
      'about-us': '/about',
      'terms-conditions': '/terms',
      'privacy-policy': '/privacy',
      'faq': '/faq',
      'contact': '/contact',
      'careers': '/careers'
    };
    
    const pagePath = pageMap[filename];
    if (pagePath) {
      window.open(pagePath, '_blank');
    } else {
      showMessage('No preview available for this file', 'error');
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Static Content Management</h1>
            <p className="text-gray-600 mt-2">Manage static page content using simple JSON files</p>
          </div>
          <button
            onClick={() => router.push('/admin')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <X className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
        </div>

        {/* Messages */}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-green-700">{success}</span>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* File List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                Content Files
              </h2>
              
              {loading && contentFiles.length === 0 ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading files...</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {contentFiles.map((file) => (
                    <div
                      key={file.name}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedFile === file.name
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => loadFileContent(file.name)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800">{file.title}</h3>
                          <p className="text-sm text-gray-500">{file.name}.json</p>
                          <div className="flex items-center text-xs text-gray-400 mt-1">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(file.lastUpdated).toLocaleDateString()}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            previewPage(file.name);
                          }}
                          className="text-gray-400 hover:text-blue-600 p-1"
                          title="Preview page"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Content Editor */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {selectedFile ? `Editing: ${selectedFile}.json` : 'Select a file to edit'}
                  </h2>
                  {selectedFile && (
                    <div className="flex space-x-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => {
                              setIsEditing(false);
                              loadFileContent(selectedFile); // Reset content
                            }}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded flex items-center space-x-1"
                          >
                            <X className="w-4 h-4" />
                            <span>Cancel</span>
                          </button>
                          <button
                            onClick={saveFileContent}
                            disabled={saving}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded flex items-center space-x-1 disabled:opacity-50"
                          >
                            <Save className="w-4 h-4" />
                            <span>{saving ? 'Saving...' : 'Save'}</span>
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded flex items-center space-x-1"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6">
                {selectedFile ? (
                  <div className="space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h3 className="font-medium text-yellow-800 mb-2">⚠️ Important Notes:</h3>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• This content is in JSON format - be careful with syntax</li>
                        <li>• Changes are saved immediately when you click Save</li>
                        <li>• Always test your changes by previewing the page</li>
                        <li>• Invalid JSON will prevent saving</li>
                      </ul>
                    </div>

                    <div className="relative">
                      <textarea
                        value={fileContent}
                        onChange={(e) => setFileContent(e.target.value)}
                        disabled={!isEditing}
                        className={`w-full h-96 p-4 border rounded-lg font-mono text-sm ${
                          isEditing
                            ? 'border-gray-300 bg-white'
                            : 'border-gray-200 bg-gray-50 text-gray-600'
                        }`}
                        placeholder="File content will appear here..."
                        spellCheck="false"
                      />
                      {loading && (
                        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-500 mb-2">No file selected</h3>
                    <p className="text-gray-400">Select a content file from the list to view and edit its content.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
