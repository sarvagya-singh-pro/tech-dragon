"use client";

import dynamic from 'next/dynamic';
import { Button } from "../components/ui/button";
import { useRef, useEffect, useState, useMemo } from "react";
import { BlogCard } from "../components/ui/blog";
import Navbar from "../components/ui/navbar";
import { useRouter } from 'next/navigation';
import { fetchAllBlogs, Blog } from '@/lib/blogService';
import Footer from "@/components/ui/footer";
import Image from 'next/image';

// Ultra-lazy load 3D - only after user interaction or delay
const DragonScene = dynamic(() => import('@/components/DragonScene'), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-800">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-gray-500 text-sm">Loading 3D Dragon...</p>
      </div>
    </div>
  )
});

// Lazy load modal
const NewsletterModal = dynamic(() => import('@/components/ui/modal'), { ssr: false });

export default function Home() {
  const landingRef = useRef(null);
  const blogRef = useRef(null);
  const router = useRouter();
  
  // State management
  const [landingVisible, setLandingVisible] = useState(false);
  const [blogVisible, setBlogVisible] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);
  const [shouldLoadDragon, setShouldLoadDragon] = useState(false);
  
  const postsPerPage = 6;

  // Load blogs with abort controller for cleanup
  useEffect(() => {
    const controller = new AbortController();
    
    async function loadBlogs() {
      try {
        setLoading(true);
        const data = await fetchAllBlogs();
        
        if (!controller.signal.aborted) {
          setBlogs(data);
          setDisplayedPosts(data.slice(0, postsPerPage));
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error('Failed to load blogs:', err);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadBlogs();
    
    return () => controller.abort();
  }, []); 

  // Defer 3D loading - load after page interactive or user interaction
  useEffect(() => {
    // Strategy 1: Load after delay
    const loadDragonTimer = setTimeout(() => {
      setShouldLoadDragon(true);
    }, 1500);
    
    // Strategy 2: Load on first user interaction
    const handleInteraction = () => {
      setShouldLoadDragon(true);
    };
    
    window.addEventListener('mousemove', handleInteraction, { once: true, passive: true });
    window.addEventListener('scroll', handleInteraction, { once: true, passive: true });
    window.addEventListener('touchstart', handleInteraction, { once: true, passive: true });
    
    return () => {
      clearTimeout(loadDragonTimer);
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

  // Optimized intersection observers with cleanup
  useEffect(() => {
    const observerOptions = { 
      threshold: 0.1, 
      rootMargin: '50px'
    };
    
    const observers = [];
    
    // Landing section observer
    if (landingRef.current) {
      const landingObserver = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setLandingVisible(true);
          landingObserver.disconnect();
        }
      }, observerOptions);
      
      landingObserver.observe(landingRef.current);
      observers.push(landingObserver);
    }

    // Blog section observer
    if (blogRef.current) {
      const blogObserver = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setBlogVisible(true);
          blogObserver.disconnect();
        }
      }, observerOptions);
      
      blogObserver.observe(blogRef.current);
      observers.push(blogObserver);
    }

    return () => observers.forEach(obs => obs.disconnect());
  }, []);

  // Load more handler with requestAnimationFrame for better performance
  const handleLoadMore = () => {
    setIsLoading(true);
    requestAnimationFrame(() => {
      const nextPosts = blogs.slice(
        displayedPosts.length, 
        displayedPosts.length + postsPerPage
      );
      setDisplayedPosts(prev => [...prev, ...nextPosts]);
      setIsLoading(false);
    });
  };

  // Memoize blog cards to prevent unnecessary re-renders
  const blogCards = useMemo(() => 
    displayedPosts.map((post, index) => (
      <div 
        key={post.id}
        className={blogVisible ? 'animate-fadeIn' : 'opacity-0'}
        style={{ 
          animationDelay: `${index * 50}ms`,
          animationFillMode: 'both'
        }}
      >
        <BlogCard
          title={post.enhanced_title || post.title}
          summary={post.summary || post.content?.substring(0, 150) + '...'}
          date={post.date_created}
          uid={post.id}
        />
      </div>
    )), [displayedPosts, blogVisible]
  );

  return (
    <main className="min-h-screen bg-black text-white font-sans">
      <Navbar />

      {/* Landing Section with 3D Dragon */}
      <section
        ref={landingRef}
        className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center px-6 md:px-10 py-20"
      >
        {/* Left: Text Content */}
        <div className={`space-y-6 ${landingVisible ? 'animate-fadeIn' : 'opacity-0'}`}>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Enter the Realm of <span className="text-gray-400">Future</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-lg">
            Explore cutting-edge tech insights, AI breakthroughs, and next-gen web development
          </p>

          <Button 
            onClick={() => router.push('/articles')} 
            className="bg-white text-black text-lg px-8 py-4 hover:bg-gray-200 transition-colors"
          >
            Explore Blogs
          </Button>
        </div>

        {/* Right: 3D Dragon */}
        <div className={`h-[400px] md:h-[500px] ${landingVisible ? 'animate-fadeIn' : 'opacity-0'}`}>
          {shouldLoadDragon ? (
            <DragonScene />
          ) : (
            <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-800">
              <div className="text-center space-y-3">
                <div className="text-6xl animate-pulse">🐉</div>
                <p className="text-gray-500 text-sm">Preparing Experience...</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Blog Cards Section */}
      <section 
        ref={blogRef} 
        className="px-6 md:px-10 pt-20 pb-20 max-w-7xl mx-auto"
      >
        <h2 className={`text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-600 bg-clip-text text-transparent ${blogVisible ? 'animate-slideUp' : 'opacity-0'}`}>
          Latest Tech Chronicles
        </h2>

        <div className={`h-1 rounded-full mb-12 bg-blue-500 transition-all duration-1000 ${blogVisible ? 'w-24' : 'w-0'}`} />

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {blogCards}
            </div>

            {displayedPosts.length < blogs.length && (
              <div className="mt-12 text-center">
                <button
                  className="bg-gray-800 px-8 py-4 rounded-lg font-semibold hover:bg-gray-700 disabled:opacity-50 transition-colors"
                  onClick={handleLoadMore}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Loading...
                    </span>
                  ) : (
                    "Load More Chronicles"
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* About Section */}
      <section className="px-6 md:px-10 py-20 max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-white to-blue-600 bg-clip-text text-transparent text-center">
          Meet the Tech Wielder
        </h2>

        <div className="flex flex-col md:flex-row items-center gap-10 justify-center">
          <div className="relative w-40 h-40 md:w-48 md:h-48 flex-shrink-0">
            <Image
              src="/profile.png"
              alt="Sarvagya Singh"
              fill
              className="rounded-full object-cover"
              sizes="(max-width: 768px) 160px, 192px"
              quality={80}
              loading="lazy"
            />
          </div>

          <div className="max-w-xl">
            <p className="text-lg text-gray-300 mb-4">
              Hi, I'm <span className="text-white font-semibold">Sarvagya Singh</span>, a future-forward tech enthusiast, full-stack developer, and creative coder blending AI, 3D, and next-gen web experiences.
            </p>
            <p className="text-gray-400">
              Whether I'm building React-powered dragons or training neural networks to detect diseases, I code with purpose: to shape tomorrow with design, data, and logic.
            </p>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="px-6 md:px-10 py-20 max-w-6xl mx-auto text-center relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-600 bg-clip-text text-transparent">
            Join the Future
          </h2>

          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Get exclusive tech insights, cutting-edge tutorials, and early access to dragon-powered content
          </p>

          <button
            onClick={() => setShowNewsletterModal(true)}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg hover:shadow-cyan-500/25"
          >
            Subscribe Now 🚀
          </button>
        </div>
      </section>

      <Footer />

      {/* Newsletter Modal - Only render when open */}
      {showNewsletterModal && (
        <NewsletterModal 
          isOpen={showNewsletterModal} 
          onClose={() => setShowNewsletterModal(false)} 
        />
      )}
    </main>
  );
}
