'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSun, FiMoon, FiSearch, FiGlobe, FiImage, FiShare2, FiCode, FiBarChart2, FiDownload } from 'react-icons/fi';

interface MediaItem {
  type: 'image' | 'video' | 'audio';
  url: string;
  alt?: string;
  title?: string;
  dimensions?: {
    width?: string;
    height?: string;
  };
}

interface SocialMetadata {
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
}

interface SEOMetadata {
  robots?: string;
  keywords?: string;
  viewport?: string;
  author?: string;
  canonical?: string;
  language?: string;
}

interface ScriptInfo {
  type: string;
  src?: string;
  inline?: boolean;
  async?: boolean;
  defer?: boolean;
}

interface StyleInfo {
  href?: string;
  inline?: boolean;
  media?: string;
}

interface TechnologyInfo {
  scripts: ScriptInfo[];
  styles: StyleInfo[];
  frameworks: string[];
  analytics: string[];
}

interface ScrapedData {
  url: string;
  title?: string;
  description?: string;
  favicon?: string;
  links?: Array<{ url: string; text: string; isExternal: boolean }>;
  headings?: Array<{ level: number; text: string }>;
  mainContent?: string;
  media?: MediaItem[];
  socialMetadata?: SocialMetadata;
  seoMetadata?: SEOMetadata;
  technologies?: TechnologyInfo;
  statistics?: {
    wordCount: number;
    paragraphCount: number;
    mediaCount: number;
    linkCount: number;
    headingCount: number;
  };
  timestamp?: string;
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ScrapedData | null>(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('basic');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check system preference for dark mode
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  // Prevent hydration issues
  if (!mounted) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    setLoading(true);
    setError('');
    setData(null);

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to scrape the URL');
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!data) return;

    const fileName = `scrape-${new URL(data.url).hostname}-${new Date().toISOString().slice(0,10)}.json`;
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = href;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  const renderMediaItem = (item: MediaItem, index: number) => {
    switch (item.type) {
      case 'image':
        return (
          <div key={index} className="relative group">
            <img
              src={item.url}
              alt={item.alt || 'Scraped image'}
              className="w-full h-48 object-cover rounded-lg"
            />
            {item.title && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                {item.title}
              </div>
            )}
          </div>
        );
      case 'video':
        return (
          <div key={index} className="aspect-video">
            {item.url.includes('youtube.com') ? (
              <iframe
                src={item.url}
                title={item.title || 'Scraped video'}
                className="w-full h-full rounded-lg"
                allowFullScreen
              />
            ) : (
              <video
                src={item.url}
                title={item.title || 'Scraped video'}
                controls
                className="w-full h-full rounded-lg"
              />
            )}
          </div>
        );
      case 'audio':
        return (
          <div key={index} className="w-full">
            <audio
              src={item.url}
              controls
              className="w-full"
              title={item.title || 'Scraped audio'}
            />
            {item.title && (
              <p className="text-sm text-gray-600 mt-1">{item.title}</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: FiGlobe },
    { id: 'media', label: 'Media', icon: FiImage },
    { id: 'social', label: 'Social', icon: FiShare2 },
    { id: 'seo', label: 'SEO', icon: FiSearch },
    { id: 'tech', label: 'Technologies', icon: FiCode },
    { id: 'stats', label: 'Statistics', icon: FiBarChart2 },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <main className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text"
              >
                Web Scraper Pro
              </motion.h1>
              {data?.favicon && (
                <motion.img
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  src={data.favicon}
                  alt="Site favicon"
                  className="w-8 h-8 rounded-lg shadow-lg"
                />
              )}
            </div>
            <div className="flex items-center gap-2">
              {data && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <FiDownload className="w-5 h-5" />
                  Save Data
                </motion.button>
              )}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {darkMode ? <FiSun className="w-6 h-6 text-yellow-400" /> : <FiMoon className="w-6 h-6 text-gray-600" />}
              </button>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex gap-4">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL to scrape..."
                required
                className="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
              >
                {loading ? 'Scraping...' : 'Scrape'}
              </button>
            </div>
          </form>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 mb-8 bg-red-100 text-red-700 rounded-lg"
            >
              {error}
            </motion.div>
          )}

          <AnimatePresence>
            {data && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex gap-2 mb-6 p-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-x-auto">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                          activeTab === tab.id
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  {activeTab === 'basic' && (
                    <div className="space-y-6">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200"
                      >
                        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
                          Basic Information
                        </h2>
                        <div className="space-y-4">
                          {data.title && (
                            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                              <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Page Title</h3>
                              <p className="text-gray-900 dark:text-white">{data.title}</p>
                            </div>
                          )}
                          {data.description && (
                            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                              <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Meta Description</h3>
                              <p className="text-gray-900 dark:text-white">{data.description}</p>
                            </div>
                          )}
                          {data.mainContent && (
                            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                              <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Main Content</h3>
                              <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-4">{data.mainContent}</p>
                            </div>
                          )}
                        </div>
                      </motion.div>

                      {data.headings && data.headings.length > 0 && (
                        <div className="border border-gray-200 rounded-lg p-4">
                          <h2 className="text-xl font-semibold mb-4">Page Structure</h2>
                          <div className="space-y-2">
                            {data.headings.map((heading, index) => (
                              <div
                                key={index}
                                style={{ marginLeft: `${(heading.level - 1) * 1.5}rem` }}
                                className="text-gray-800"
                              >
                                <span className="text-gray-500 text-sm mr-2">H{heading.level}</span>
                                {heading.text}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'media' && data.media && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h2 className="text-xl font-semibold mb-4">Media Content</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {data.media.map((item, index) => renderMediaItem(item, index))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'social' && data.socialMetadata && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h2 className="text-xl font-semibold mb-4">Social Media Metadata</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h3 className="font-medium text-lg">Open Graph</h3>
                          {Object.entries(data.socialMetadata)
                            .filter(([key]) => key.startsWith('og'))
                            .map(([key, value]) => (
                              <div key={key}>
                                <h4 className="font-medium text-gray-700">{key.replace('og', '')}</h4>
                                <p className="text-sm text-gray-600">{value || 'Not specified'}</p>
                              </div>
                            ))}
                        </div>
                        <div className="space-y-4">
                          <h3 className="font-medium text-lg">Twitter</h3>
                          {Object.entries(data.socialMetadata)
                            .filter(([key]) => key.startsWith('twitter'))
                            .map(([key, value]) => (
                              <div key={key}>
                                <h4 className="font-medium text-gray-700">{key.replace('twitter', '')}</h4>
                                <p className="text-sm text-gray-600">{value || 'Not specified'}</p>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'seo' && data.seoMetadata && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h2 className="text-xl font-semibold mb-4">SEO Information</h2>
                      <div className="grid gap-4">
                        {Object.entries(data.seoMetadata).map(([key, value]) => (
                          <div key={key}>
                            <h3 className="font-medium text-gray-700 capitalize">{key}</h3>
                            <p className="text-sm text-gray-600">{value || 'Not specified'}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'tech' && data.technologies && (
                    <div className="space-y-6">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h2 className="text-xl font-semibold mb-4">Technologies Used</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {data.technologies.frameworks.length > 0 && (
                            <div>
                              <h3 className="font-medium text-lg mb-2">Frameworks & Libraries</h3>
                              <ul className="list-disc pl-5 space-y-1">
                                {data.technologies.frameworks.map((framework, index) => (
                                  <li key={index}>{framework}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {data.technologies.analytics.length > 0 && (
                            <div>
                              <h3 className="font-medium text-lg mb-2">Analytics Tools</h3>
                              <ul className="list-disc pl-5 space-y-1">
                                {data.technologies.analytics.map((tool, index) => (
                                  <li key={index}>{tool}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-4">
                        <h2 className="text-xl font-semibold mb-4">Resources</h2>
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-medium text-lg mb-2">Scripts ({data.technologies.scripts.length})</h3>
                            <div className="space-y-2">
                              {data.technologies.scripts.map((script, index) => (
                                <div key={index} className="text-sm">
                                  {script.src ? (
                                    <a href={script.src} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                      {script.src}
                                    </a>
                                  ) : (
                                    <span className="text-gray-600">Inline script ({script.type})</span>
                                  )}
                                  {(script.async || script.defer) && (
                                    <span className="ml-2 text-gray-500">
                                      {script.async && 'async'} {script.defer && 'defer'}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h3 className="font-medium text-lg mb-2">Stylesheets ({data.technologies.styles.length})</h3>
                            <div className="space-y-2">
                              {data.technologies.styles.map((style, index) => (
                                <div key={index} className="text-sm">
                                  {style.href ? (
                                    <a href={style.href} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                      {style.href}
                                    </a>
                                  ) : (
                                    <span className="text-gray-600">Inline styles</span>
                                  )}
                                  {style.media && (
                                    <span className="ml-2 text-gray-500">({style.media})</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'stats' && data.statistics && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h2 className="text-xl font-semibold mb-4">Page Statistics</h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {Object.entries(data.statistics).map(([key, value]) => (
                          <div key={key} className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">{value}</div>
                            <div className="text-sm text-gray-600 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </div>
                          </div>
                        ))}
                        {data.timestamp && (
                          <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-sm font-medium text-blue-600">
                              {new Date(data.timestamp).toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600">Scraped At</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
