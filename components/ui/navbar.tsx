"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Adjust path to your Firebase config
import { useRouter } from "next/navigation";

interface BlogResult {
  id: string;
  title: string;
  enhanced_title?: string;
  slug?: string;
}

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<BlogResult[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const performSearch = async (input: string) => {
    if (!input.trim()) {
      setResults([]);
      return;
    }
  
    setLoading(true);
    
    try {
      const blogsRef = collection(db, "blogs");
      
      // Fetch all published blogs (consider caching this)
      const searchQuery = query(
        blogsRef,
        where("published", "==", true)
      );
  
      const snapshot = await getDocs(searchQuery);
      
      const searchTerm = input.toLowerCase().trim();
      
      // Filter client-side for partial matches
      const searchResults = snapshot.docs
        .filter((doc) => {
          const data = doc.data();
          const searchableText = `${data.title} ${data.enhanced_title} ${data.category} ${data.summary || ''}`.toLowerCase();
          return searchableText.includes(searchTerm);
        })
        .map((doc) => ({
          id: doc.id,
          title: doc.data().title,
          enhanced_title: doc.data().enhanced_title,
          slug: doc.data().slug
        }))
        .slice(0, 10); // Limit to 10 results
  
      setResults(searchResults);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (searchQuery.trim() === "") {
      setResults([]);
      setLoading(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      performSearch(searchQuery);
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery]);

  const handleResultClick = (result: BlogResult) => {
    // Navigate to the blog article page
    router.push(`/articles/${result.slug || result.id}`);
    setSearchQuery("");
    setResults([]);
  };

  return (
    <div className="p-6 border-b border-white/10 bg-black text-white">
      <nav className="flex flex-col md:flex-row justify-between items-center gap-4">
        <img src="/logo.svg" alt="TechDragon Logo" className="h-20 w-auto" />

        {/* Navigation Links */}
        <div className="flex gap-6 text-sm font-medium">
          <a href="/" className="hover:text-gray-300 transition-colors">Home</a>
          <a href="/articles" className="hover:text-gray-300 transition-colors">Articles</a>
          <a href="/about" className="hover:text-gray-300 transition-colors">About</a>
          <a href="/contact" className="hover:text-gray-300 transition-colors">Contact</a>
        </div>

        {/* Search Box */}
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 z-10" size={18} />
          <Input
          type="input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles..."
            className="pl-10 text-white bg-neutral-800 border-none focus:ring-2 focus:ring-white/20"
          />
          
          {/* Results dropdown */}
          {searchQuery && (
            <div className="absolute w-full mt-2 bg-neutral-900 text-white rounded-md shadow-lg max-h-96 overflow-y-auto z-20">
              {loading ? (
                <div className="p-4 space-y-2">
                  <Skeleton className="h-5 w-full bg-neutral-700" />
                  <Skeleton className="h-5 w-full bg-neutral-700" />
                  <Skeleton className="h-5 w-full bg-neutral-700" />
                </div>
              ) : results.length > 0 ? (
                <div className="py-2">
                  {results.map((result) => (
                    <div
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      className="hover:bg-neutral-700 px-4 py-3 cursor-pointer transition-colors border-b border-neutral-800 last:border-b-0"
                    >
                      <p className="font-medium text-sm line-clamp-2">
                        {result.enhanced_title || result.title}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4">
                  <p className="text-sm text-white/50">No results found for "{searchQuery}"</p>
                </div>
              )}
            </div>
          )}
        </div>

        <Button  variant="default" size="sm"  className="text-black bg-white hover:bg-gray-300">Subscribe</Button>
      </nav>
    </div>
  );
}
