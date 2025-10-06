"use client";

import dynamic from 'next/dynamic';
import { Button } from "../components/ui/button";
import { Suspense, useRef, useEffect, useState } from "react";
import { BlogCard } from "../components/ui/blog";
import Navbar from "../components/ui/navbar";
import { useRouter } from 'next/navigation';
import { fetchAllBlogs, Blog } from '@/lib/blogService';
import Footer from "@/components/ui/footer";
import Image from 'next/image';

// Lazy load heavy components
const NewsletterModal = dynamic(() => import('@/components/ui/modal'), {
  ssr: false,
  loading: () => null
});

// Lazy load 3D components only when needed
const DragonScene = dynamic(() => import('@/components/DragonScene'), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] flex items-center justify-center bg-gradient-to-br from-gray-900 to-black rounded-xl">
      <div className="animate-pulse text-gray-500">Loading 3D Model...</div>
    </div>
  )
});

// Simple animation variants (replacing framer-motion heavy animations)
const fadeInClass = "animate-fadeIn";
const slideUpClass = "animate-slideUp";

export default function Home() {
  const landingRef = useRef(null);
  const router = useRouter();
  const [landingVisible, setLandingVisible] = useState(false);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);
  const [displayedPosts, setDisplayedPosts] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [blogVisible, setBlogVisible] = useState(false);
  const blogRef = useRef(null);
  const postsPerPage = 6;

  // Load blogs
  useEffect(() => {
    async function loadBlogs() {
      try {
        setLoading(true);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 10000)
        );
        
        const data = await Promise.race([
          fetchAllBlogs(),
          timeoutPromise
        ]) as Blog[];
        
        setBlogs(data);
        setDisplayedPosts(data.slice(0, 6));
        setError(null);
      } catch (err: any) {
        console.error('Failed to load blogs:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadBlogs();
  }, []); 

  // Intersection observers
  useEffect(() => {
    const observerOptions = { threshold: 0.2, rootMargin: '50px' };
    
    const landingObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setLandingVisible(true);
        landingObserver.disconnect();
      }
    }, observerOptions);

    const blogObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setBlogVisible(true);
        blogObserver.disconnect();
      }
    }, observerOptions);

    if (landingRef.current) landingObserver.observe(landingRef.current);
    if (blogRef.current) blogObserver.observe(blogRef.current);

    return () => {
      landingObserver.disconnect();
      blogObserver.disconnect();
    };
  }, []);

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      const nextPosts = blogs.slice(displayedPosts.length, displayedPosts.length + postsPerPage);
      setDisplayedPosts([...displayedPosts, ...nextPosts]);
      setIsLoading(false);
    }, 500);
  };

  return (
    <main className="min-h-screen bg-black text-white font-sans overflow-y-auto relative">
      {/* Navbar */}
      <Navbar />

      {/* Landing Page Main Section */}
      <section
        ref={landingRef}
        className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start px-6 md:px-10 py-20"
      >
        {/* Left Text & Buttons */}
        <div className={`space-y-6 ${landingVisible ? fadeInClass : 'opacity-0'}`}>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight text-white">
            Enter the Realm of <span className="text-gray-400">Future</span>
          </h1>

          <Button 
            variant="default" 
            size="lg" 
            onClick={() => router.push('/articles')} 
            className="bg-white text-black text-lg px-6 py-3 hover:bg-gray-300 transition-colors"
          >
            Explore Blogs
          </Button>
        </div>

        {/* Right 3D Canvas - Lazy loaded */}
        <div className={landingVisible ? fadeInClass : 'opacity-0'}>
          <Suspense fallback={
            <div className="h-[500px] bg-gradient-to-br from-gray-900 to-black rounded-xl animate-pulse" />
          }>
            {landingVisible && <DragonScene />}
          </Suspense>
        </div>
      </section>

      {/* Blog Cards Section */}
      <section
        ref={blogRef}
        className="px-6 md:px-10 pt-32 pb-20 max-w-7xl mx-auto"
      >
        <h2 className={`text-4xl md:text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-600 ${blogVisible ? slideUpClass : 'opacity-0'}`}>
          Latest Tech Chronicles
        </h2>

        <div className={`w-24 h-1 rounded-full mb-12 bg-blue-500/80 ${blogVisible ? 'animate-expandWidth' : 'w-0'}`} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {displayedPosts.map((post, index) => (
            <div 
              key={post.id}
              className={blogVisible ? fadeInClass : 'opacity-0'}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <BlogCard
                title={post.enhanced_title}
                summary={post.summary}
                date={post.date}
                uid={post.id}
              />
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {displayedPosts.length < blogs.length && (
          <div className="mt-12 text-center">
            <button
              className="bg-gray-800 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
              onClick={handleLoadMore}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Load More Chronicles"}
            </button>
          </div>
        )}
      </section>

      {/* About Section */}
      <section className="px-6 md:px-10 pt-32 pb-20 max-w-6xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-600">
          Meet the Tech Wielder
        </h2>

        <div className="flex flex-col md:flex-row items-center gap-10 justify-center">
          <div className="relative w-40 h-40 md:w-52 md:h-52">
            <Image
              src="/profile.png"
              alt="Sarvagya Profile"
              width={208}
              height={208}
              className="rounded-full border-4 hover:scale-105 transition-transform object-cover"
              priority={false}
              quality={85}
            />
          </div>

          <div className="max-w-xl text-lg text-gray-300 text-left">
            <p className="mb-4">
              Hi I am Sarvagya, A future-forward tech enthusiast, full-stack developer, and creative coder blending AI, 3D, and next-gen web experiences. Whether I'm building React-powered dragons or training neural networks to detect diseases, I code with a purpose: to shape tomorrow with design, data, and logic.
            </p>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="px-6 md:px-10 py-32 max-w-6xl mx-auto relative overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500/30 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-purple-500/30 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-600">
            Join the Future
          </h2>

          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Get exclusive tech insights, cutting-edge tutorials, and early access to the latest dragon-powered content
          </p>

          <button
            onClick={() => setShowNewsletterModal(true)}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-lg hover:scale-105"
          >
            Subscribe Now 🚀
          </button>
        </div>
      </section>

      <Footer />

      {/* Newsletter Modal - Only load when needed */}
      {showNewsletterModal && (
        <NewsletterModal 
          isOpen={showNewsletterModal} 
          onClose={() => setShowNewsletterModal(false)} 
        />
      )}

      {/* Optimized CSS animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes expandWidth {
          from { width: 0; }
          to { width: 6rem; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
        
        .animate-slideUp {
          animation: slideUp 0.8s ease-out forwards;
        }
        
        .animate-expandWidth {
          animation: expandWidth 1s ease-out forwards;
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Hide cursor effects on mobile for better performance */
        @media (pointer: coarse) {
          body { cursor: auto !important; }
        }
      `}</style>
    </main>
  );
}
