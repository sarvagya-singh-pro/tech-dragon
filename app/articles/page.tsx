"use client"
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { fetchAllBlogs, Blog } from '@/lib/blogService';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/ui/footer';

export default function Articles() {
  const [searchTerm, setSearchTerm] = useState('');
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

 useEffect(() => {
    async function loadBlogs() {
      try {
        setLoading(true);
        console.log('Loading blogs...');
        
        // Add timeout to prevent infinite loading
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout - check your Firebase connection')), 10000)
        );
        
        const data = await Promise.race([
          fetchAllBlogs(),
          timeoutPromise
        ]) as Blog[];
        
        console.log('Blogs loaded:', data);
        setBlogs(data);
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

  const filteredPosts = blogs.filter((post) =>
    post.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.enhanced_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar/>
      <header className="py-8 px-4 sm:px-6 lg:px-8 border-b border-gray-800">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white">Articles</h1>
          <p className="mt-2 text-gray-400">
            Explore our latest tech insights and articles ({blogs.length} posts)
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="relative max-w-md mx-auto mb-12">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <Input
            type="text"
            placeholder="Search articles..."
            className="pl-10 bg-black border-gray-700 text-white placeholder-gray-500 focus:ring-white focus:border-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
            <span className="ml-3 text-gray-400">Loading articles...</span>
          </div>
        )}

        {error && (
          <div className="max-w-2xl mx-auto">
            <Card className="bg-black border-red-700">
              <CardContent className="pt-6">
                <p className="text-red-400">Error loading articles: {error}</p>
                <p className="text-sm text-gray-400 mt-2">
                  Please check your Firestore security rules and Firebase configuration.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {!loading && !error && filteredPosts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">
              {searchTerm ? 'No articles found matching your search.' : 'No articles available yet.'}
            </p>
          </div>
        )}

        {!loading && !error && filteredPosts.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => {
              const excerpt = post.content?.substring(0, 150) + '...' || 'No content available';
              
              const title = post.enhanced_title || `Article ${post.id.substring(0, 8)}`;
              const dateS=post.date_created
              let date = dateS;
              return (
                <Card 
                  key={post.id} 
                  className="group bg-black border-gray-800 hover:border-white transition-all duration-500 overflow-hidden relative"
                >
                  {/* Wind flowing effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out pointer-events-none" />
                  
                  <CardHeader className="relative z-10">
                    <CardTitle className="text-xl font-semibold text-white line-clamp-2 group-hover:text-gray-200 transition-colors">
                      {title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <p className="text-gray-400 mb-4 line-clamp-3 group-hover:text-gray-300 transition-colors">
                      {excerpt}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                   
                    </div>
                    <Link href={`/articles/${post.id}`}>
                      <Button variant="default" size="sm"  className="w-full bg-white text-black hover:bg-gray-200 transition-all duration-300 transform group-hover:scale-105">
                        Read More
                      </Button>

                    </Link>
                   
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>

    <Footer/>
    </div>
  );
}