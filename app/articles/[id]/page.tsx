"use client"
import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, ArrowLeft, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchBlogById, Blog } from '@/lib/blogService';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/ui/footer';


export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  useEffect(() => {
    async function loadBlog() {
      try {
        setLoading(true);
        console.log('Loading blog with ID:', id);
        
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout - check your Firebase connection')), 10000)
        );
        
        const data = await Promise.race([
          fetchBlogById(id),
          timeoutPromise
        ]) as Blog;
        
        console.log('Blog loaded:', data);
        setBlog(data);
        setError(null);
      } catch (err: any) {
        console.error('Failed to load blog:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }


    if (id) {
      loadBlog();
    }
  }, [id]);


  const formatDate = (dateString: string) => {
    const date = dateString
    return date
  };


  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };


  // Memoize the rendered content so it doesn't regenerate on every scroll
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
  }, [blog?.content]); // Only regenerate when blog content changes


  return (
    <div className="min-h-screen bg-black text-white">
      {/* Reading Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-blue-500 z-50 transition-all duration-150 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />

      <Navbar />

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center min-h-[80vh]">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
          <span className="ml-3 text-gray-400">Loading article...</span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <Card className="bg-black border-red-700">
            <CardContent className="pt-6">
              <p className="text-red-400 text-lg mb-4">Error loading article: {error}</p>
              <p className="text-sm text-gray-400 mb-6">
                Please check your Firestore configuration or try again later.
              </p>
              <Link href="/articles">
                <Button variant="default" size="md"  className="bg-white text-black hover:bg-gray-200">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Articles
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Article Content */}
      {!loading && !error && blog && (
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
              {blog.enhanced_title || `Article ${blog.id.substring(0, 8)}`}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-gray-400">
              {blog.date_created && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{formatDate(blog.date_created)}</span>
                </div>
              )}
              {blog.content && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{calculateReadingTime(blog.content)}</span>
                </div>
              )}
              {blog.search_keywords && (
                <div className="flex items-center gap-2">
                  <span className="text-sm px-3 py-1 bg-gray-800 rounded-full">
                    {blog.search_keywords}
                  </span>
                </div>
              )}
            </div>
          </header>

          {/* Featured Image */}
          {blog.image && blog.image.url && (
            <div className="relative w-full h-[400px] md:h-[500px] mb-12 rounded-lg overflow-hidden border border-gray-800">
              <Image
                src={blog.image.url}
                alt={blog.image.alt_text || blog.enhanced_title || 'Article featured image'}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              />
            </div>
          )}

          {/* Article Body with Proper Paragraphs */}
          <div className="prose prose-invert prose-lg max-w-none">
            {blog.content ? (
              <div className="text-gray-300">
                {renderedContent}
              </div>
            ) : (
              <p className="text-gray-400">No content available for this article.</p>
            )}
          </div>

          {/* Article Footer */}
          <Footer/>
        </article>
      )}

      {/* Not Found State */}
      {!loading && !error && !blog && (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold text-white mb-4">Article Not Found</h2>
            <p className="text-gray-400 text-lg mb-8">
              The article you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/articles">
              <Button variant="default" size="sm"  className="bg-white text-black hover:bg-gray-200">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Browse All Articles
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
