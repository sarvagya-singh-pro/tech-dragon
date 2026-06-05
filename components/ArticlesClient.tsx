// components/ArticleClient.tsx
"use client"
import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Blog } from '@/lib/blogService';

interface ArticleClientProps {
  blog: Blog | null;
}

export default function ArticleClient({ blog }: ArticleClientProps) {
  const [scrollProgress, setScrollProgress] = useState(0);

  // Scroll progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      
      const totalHeight = documentHeight - windowHeight;
      const progress = (scrollTop / totalHeight) * 100;
      
      setScrollProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return '';
    }
  };

  const calculateReadingTime = (content: string) => {
    if (!content) return '1 min read';
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  // Memoize the rendered content
  const renderedContent = useMemo(() => {
    if (!blog?.content) return null;

    const cleanContent = blog.content.replace(/\s+/g, ' ').trim();
    const sentences = cleanContent.split(/(?<=[.?!])\s+/);

    const paragraphs: string[] = [];
    let currentParagraph = '';
    let currentWordCount = 0;

    // Use a seeded random for consistent paragraph sizes
    let seed = 12345;
    const seededRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    const getTargetSize = () => {
      const options = [100, 70, 120, 110, 170, 190, 40, 150, 200];
      return options[Math.floor(seededRandom() * options.length)];
    };

    let targetSize = getTargetSize();

    for (const sentence of sentences) {
      const wordCount = sentence.split(' ').length;
      currentParagraph += sentence + ' ';
      currentWordCount += wordCount;

      if (currentWordCount >= targetSize) {
        paragraphs.push(currentParagraph.trim());
        currentParagraph = '';
        currentWordCount = 0;
        targetSize = getTargetSize();
      }
    }

    if (currentParagraph.trim()) {
      paragraphs.push(currentParagraph.trim());
    }

    return paragraphs.map((paragraph, index) => (
      <p key={index} className="mb-6 text-gray-300 leading-relaxed text-lg">
        {paragraph}
      </p>
    ));
  }, [blog?.content]);

  // Handle missing blog data
  if (!blog) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Link href="/articles">
          <Button 
            size="md" 
            variant="ghost" 
            className="mb-8 text-gray-400 hover:text-white hover:bg-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Articles
          </Button>
        </Link>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-white mb-4">Article Not Found</h1>
          <p className="text-gray-400">The article you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  // Safe accessors for blog properties
  const blogTitle = blog.enhanced_title || blog.title || `Article ${(blog.id || '').substring(0, 8)}`;
  const blogDate = blog.date_created || blog.created_at || '';
  const blogTags = Array.isArray(blog.tags) ? blog.tags : [];
  const blogImageUrl = blog.image?.url || '';
  const blogImageAlt = blog.image?.alt_text || blog.enhanced_title || blog.title || 'Article featured image';

  return (
    <>
      {/* Reading Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-blue-500 z-50 transition-all duration-150 ease-out"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />

      <article className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link href="/articles">
          <Button 
            size="md" 
            variant="ghost" 
            className="mb-8 text-gray-400 hover:text-white hover:bg-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Articles
          </Button>
        </Link>

        {/* Article Header */}
        <header className="mb-8 pb-8 border-b border-gray-800">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {blogTitle}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-gray-400">
            {blogDate && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time className="text-sm" dateTime={blogDate}>
                  {formatDate(blogDate)}
                </time>
              </div>
            )}
            {blog.content && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{calculateReadingTime(blog.content)}</span>
              </div>
            )}
            {blogTags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                {blogTags.slice(0, 3).map((tag, index) => (
                  <span key={index} className="text-sm px-3 py-1 bg-gray-800 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Featured Image */}
        {blogImageUrl && (
          <div className="relative w-full h-[400px] md:h-[500px] mb-12 rounded-lg overflow-hidden border border-gray-800">
            <Image
              src={blogImageUrl}
              alt={blogImageAlt}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
          </div>
        )}

        {/* Article Body */}
        <div className="prose prose-invert prose-lg max-w-none">
          {blog.content ? (
            <div className="text-gray-300">
              {renderedContent}
            </div>
          ) : (
            <p className="text-gray-400">No content available for this article.</p>
          )}
        </div>
      </article>
    </>
  );
}