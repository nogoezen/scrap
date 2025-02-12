import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';
import type { Element } from 'cheerio';

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

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Add timeout to prevent long-running functions
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; WebScraper/1.0; +http://example.com)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      timeout: 15000, // 15 second timeout
      maxContentLength: 10 * 1024 * 1024, // 10MB max
    });
    const html = response.data;

    // Load the HTML into cheerio
    const $ = cheerio.load(html);

    // Basic Information
    const title = $('title').text();
    const description = $('meta[name="description"]').attr('content') || '';
    const favicon = $('link[rel="icon"], link[rel="shortcut icon"]').attr('href');
    
    // Extract all links with more details
    const links = Array.from(new Set($('a').map((_: number, element: Element) => {
      const href = $(element).attr('href');
      const text = $(element).text().trim();
      return href && href.startsWith('http') ? {
        url: href,
        text: text || href,
        isExternal: !href.includes(new URL(url).hostname),
      } : null;
    }).get().filter(Boolean)));

    // Get all headings with hierarchy
    const headings = $('h1, h2, h3, h4, h5, h6')
      .map((_: number, el: Element) => ({
        level: parseInt(el.tagName.toLowerCase().replace('h', '')),
        text: $(el).text().trim(),
      }))
      .get()
      .filter(heading => heading.text.length > 0);

    // Get main content with better detection
    const mainContent = $('main, article, [role="main"], #content, .content, .main')
      .first()
      .text()
      .trim();

    // Extract media content
    const media: MediaItem[] = [];

    // Extract images with more metadata
    $('img').each((_: number, element: Element) => {
      const src = $(element).attr('src');
      if (src) {
        const mediaItem: MediaItem = {
          type: 'image',
          url: src.startsWith('http') ? src : new URL(src, url).toString(),
          alt: $(element).attr('alt'),
          title: $(element).attr('title'),
          dimensions: {
            width: $(element).attr('width'),
            height: $(element).attr('height'),
          },
        };
        media.push(mediaItem);
      }
    });

    // Enhanced video extraction
    $('video, iframe[src*="youtube"], iframe[src*="vimeo"], iframe[src*="dailymotion"]').each((_: number, element: Element) => {
      const src = $(element).attr('src') || $(element).find('source').attr('src');
      if (src) {
        const mediaItem: MediaItem = {
          type: 'video',
          url: src.startsWith('http') ? src : new URL(src, url).toString(),
          title: $(element).attr('title'),
          dimensions: {
            width: $(element).attr('width'),
            height: $(element).attr('height'),
          },
        };
        media.push(mediaItem);
      }
    });

    // Audio extraction
    $('audio').each((_: number, element: Element) => {
      const src = $(element).attr('src') || $(element).find('source').attr('src');
      if (src) {
        const mediaItem: MediaItem = {
          type: 'audio',
          url: src.startsWith('http') ? src : new URL(src, url).toString(),
          title: $(element).attr('title'),
        };
        media.push(mediaItem);
      }
    });

    // Extract social media metadata
    const socialMetadata: SocialMetadata = {
      ogTitle: $('meta[property="og:title"]').attr('content'),
      ogDescription: $('meta[property="og:description"]').attr('content'),
      ogImage: $('meta[property="og:image"]').attr('content'),
      ogUrl: $('meta[property="og:url"]').attr('content'),
      twitterCard: $('meta[name="twitter:card"]').attr('content'),
      twitterTitle: $('meta[name="twitter:title"]').attr('content'),
      twitterDescription: $('meta[name="twitter:description"]').attr('content'),
      twitterImage: $('meta[name="twitter:image"]').attr('content'),
    };

    // Extract SEO metadata
    const seoMetadata: SEOMetadata = {
      robots: $('meta[name="robots"]').attr('content'),
      keywords: $('meta[name="keywords"]').attr('content'),
      viewport: $('meta[name="viewport"]').attr('content'),
      author: $('meta[name="author"]').attr('content'),
      canonical: $('link[rel="canonical"]').attr('href'),
      language: $('html').attr('lang'),
    };

    // Detect technologies used
    const technologies: TechnologyInfo = {
      scripts: [],
      styles: [],
      frameworks: [],
      analytics: [],
    };

    // Analyze scripts
    $('script').each((_: number, element: Element) => {
      const src = $(element).attr('src');
      const type = $(element).attr('type') || 'text/javascript';
      const scriptInfo: ScriptInfo = {
        type,
        src,
        inline: !src,
        async: $(element).attr('async') !== undefined,
        defer: $(element).attr('defer') !== undefined,
      };
      technologies.scripts.push(scriptInfo);

      // Detect common frameworks and libraries
      if (src) {
        if (src.includes('react')) technologies.frameworks.push('React');
        if (src.includes('vue')) technologies.frameworks.push('Vue.js');
        if (src.includes('angular')) technologies.frameworks.push('Angular');
        if (src.includes('jquery')) technologies.frameworks.push('jQuery');
        if (src.includes('bootstrap')) technologies.frameworks.push('Bootstrap');
        
        // Detect analytics
        if (src.includes('google-analytics') || src.includes('gtag')) {
          technologies.analytics.push('Google Analytics');
        }
        if (src.includes('hotjar')) technologies.analytics.push('Hotjar');
        if (src.includes('segment')) technologies.analytics.push('Segment');
      }
    });

    // Analyze styles
    $('link[rel="stylesheet"]').each((_: number, element: Element) => {
      const href = $(element).attr('href');
      const media = $(element).attr('media');
      technologies.styles.push({
        href,
        inline: false,
        media,
      });
    });

    // Remove duplicates from frameworks and analytics
    technologies.frameworks = Array.from(new Set(technologies.frameworks));
    technologies.analytics = Array.from(new Set(technologies.analytics));

    // Get text statistics
    const textContent = $('body').text();
    const wordCount = textContent.trim().split(/\s+/).length;
    const paragraphCount = $('p').length;

    // Return the scraped data with proper headers
    return NextResponse.json(
      {
        url,
        title,
        description,
        favicon,
        links,
        headings,
        mainContent,
        media,
        socialMetadata,
        seoMetadata,
        technologies,
        statistics: {
          wordCount,
          paragraphCount,
          mediaCount: media.length,
          linkCount: links.length,
          headingCount: headings.length,
        },
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store',
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Scraping error:', error);
    
    // Handle different types of errors
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        return NextResponse.json(
          { error: 'Request timed out' },
          { status: 408 }
        );
      }
      if (error.response?.status === 404) {
        return NextResponse.json(
          { error: 'Page not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: error.message },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 