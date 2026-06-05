// lib/blogService.ts
import { db } from '@/lib/firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  query, 
  limit, 
  orderBy,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData
} from 'firebase/firestore';
import { cache } from 'react';

export interface Blog {
  id: string;
  content: string;
  char_count: number;
  title?: string;
  enhanced_title?: string;
  author?: string;
  date_created?: string;
  createdAt?: any;
  updatedAt?: any;
  tags?: string[];
  [key: string]: any;
}

// ==================== CACHING LAYER ====================
// In-memory cache for server-side operations
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class BlogCache {
  private static instance: BlogCache;
  private cache: Map<string, CacheEntry<any>> = new Map();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  static getInstance(): BlogCache {
    if (!BlogCache.instance) {
      BlogCache.instance = new BlogCache();
    }
    return BlogCache.instance;
  }

  get<T>(key: string, ttl: number = this.DEFAULT_TTL): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    console.log(`✅ Cache HIT: ${key}`);
    return entry.data as T;
  }

  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
    console.log(`📝 Cache SET: ${key}`);
  }

  invalidate(key?: string): void {
    if (key) {
      this.cache.delete(key);
      console.log(`🗑️ Cache INVALIDATED: ${key}`);
    } else {
      this.cache.clear();
      console.log(`🗑️ Cache CLEARED: All entries`);
    }
  }

  // Clear expired entries periodically
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.DEFAULT_TTL) {
        this.cache.delete(key);
      }
    }
  }
}

const blogCache = BlogCache.getInstance();

// Cleanup cache every 10 minutes
if (typeof window === 'undefined') {
  setInterval(() => blogCache.cleanup(), 10 * 60 * 1000);
}

// ==================== OPTIMIZED FETCH FUNCTIONS ====================

/**
 * Fetch all blogs with multi-layer caching
 * Uses React cache() for request deduplication + in-memory cache for persistence
 */
export const fetchAllBlogs = cache(async (limitCount?: number): Promise<Blog[]> => {
  const cacheKey = `blogs:all:${limitCount || 'unlimited'}`;
  
  // Check in-memory cache first
  const cached = blogCache.get<Blog[]>(cacheKey);
  if (cached) return cached;

  try {
    console.log('🔥 Firestore READ: Fetching all blogs');
    const blogsRef = collection(db, 'blogs');
    let q = query(blogsRef);
    
    if (limitCount) {
      q = query(q, limit(limitCount));
    }

    const snapshot = await getDocs(q);
    
    const blogs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Blog[];

    // Store in cache
    blogCache.set(cacheKey, blogs);

    return blogs;
  } catch (error: any) {
    console.error('Error fetching blogs:', error);
    throw new Error(`Failed to fetch blogs: ${error.message}`);
  }
});

/**
 * Fetch single blog by ID with caching
 * React cache() ensures same blog isn't fetched twice in same request
 */
export const fetchBlogById = cache(async (id: string): Promise<Blog | null> => {
  const cacheKey = `blog:${id}`;
  
  // Check cache first
  const cached = blogCache.get<Blog | null>(cacheKey);
  if (cached !== null) return cached;

  try {
    console.log(`🔥 Firestore READ: Fetching blog ${id}`);
    const blogRef = doc(db, 'blogs', id);
    const blogSnap = await getDoc(blogRef);

    if (!blogSnap.exists()) {
      blogCache.set(cacheKey, null);
      return null;
    }

    const blog = {
      id: blogSnap.id,
      ...blogSnap.data(),
    } as Blog;

    blogCache.set(cacheKey, blog);
    return blog;
  } catch (error: any) {
    console.error('Error fetching blog:', error);
    throw new Error(`Failed to fetch blog: ${error.message}`);
  }
});

/**
 * Server-side search with caching
 * Fetches all blogs once and caches, then filters client-side
 */
export async function searchBlogs(keyword: string): Promise<Blog[]> {
  try {
    // Leverage cached fetchAllBlogs
    const blogs = await fetchAllBlogs();
    
    // Client-side filtering (no additional Firestore reads!)
    const searchLower = keyword.toLowerCase();
    const filtered = blogs.filter(blog => {
      return (
        blog.content?.toLowerCase().includes(searchLower) ||
        blog.title?.toLowerCase().includes(searchLower) ||
        blog.enhanced_title?.toLowerCase().includes(searchLower) ||
        blog.id.toLowerCase().includes(searchLower)
      );
    });

    return filtered;
  } catch (error: any) {
    console.error('Error searching blogs:', error);
    throw new Error(`Failed to search blogs: ${error.message}`);
  }
}

/**
 * Pagination with cursor-based approach
 * Note: Harder to cache effectively, use sparingly
 */
export async function fetchBlogsWithPagination(
  limitCount: number = 10,
  lastDocId?: string
): Promise<{ blogs: Blog[]; hasMore: boolean; lastDocId: string | null }> {
  try {
    const cacheKey = `blogs:page:${limitCount}:${lastDocId || 'first'}`;
    
    const cached = blogCache.get<{ blogs: Blog[]; hasMore: boolean; lastDocId: string | null }>(cacheKey, 2 * 60 * 1000); // 2min TTL
    if (cached) return cached;

    console.log('🔥 Firestore READ: Fetching paginated blogs');
    const blogsRef = collection(db, 'blogs');
    
    let q = query(blogsRef, limit(limitCount + 1)); // Fetch one extra to check if more exist
    
    if (lastDocId) {
      const lastDocRef = doc(db, 'blogs', lastDocId);
      const lastDocSnap = await getDoc(lastDocRef);
      if (lastDocSnap.exists()) {
        q = query(blogsRef, startAfter(lastDocSnap), limit(limitCount + 1));
      }
    }

    const snapshot = await getDocs(q);
    
    const hasMore = snapshot.docs.length > limitCount;
    const blogs = snapshot.docs.slice(0, limitCount).map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Blog[];

    const lastVisibleId = blogs.length > 0 ? blogs[blogs.length - 1].id : null;

    const result = {
      blogs,
      hasMore,
      lastDocId: lastVisibleId,
    };

    blogCache.set(cacheKey, result);
    return result;
  } catch (error: any) {
    console.error('Error fetching blogs with pagination:', error);
    throw new Error(`Failed to fetch blogs: ${error.message}`);
  }
}

/**
 * Get blog count with aggressive caching (counts change infrequently)
 */
export const getBlogCount = cache(async (): Promise<number> => {
  const cacheKey = 'blogs:count';
  
  const cached = blogCache.get<number>(cacheKey, 15 * 60 * 1000); // 15min TTL
  if (cached !== null) return cached;

  try {
    console.log('🔥 Firestore READ: Getting blog count');
    const blogsRef = collection(db, 'blogs');
    const snapshot = await getDocs(blogsRef);
    const count = snapshot.size;
    
    blogCache.set(cacheKey, count);
    return count;
  } catch (error: any) {
    console.error('Error getting blog count:', error);
    throw new Error(`Failed to get blog count: ${error.message}`);
  }
});

/**
 * Fetch recent blogs with caching
 */
export const fetchRecentBlogs = cache(async (limitCount: number = 5): Promise<Blog[]> => {
  const cacheKey = `blogs:recent:${limitCount}`;
  
  const cached = blogCache.get<Blog[]>(cacheKey);
  if (cached) return cached;

  try {
    console.log('🔥 Firestore READ: Fetching recent blogs');
    const blogsRef = collection(db, 'blogs');
    const q = query(blogsRef, orderBy('createdAt', 'desc'), limit(limitCount));

    const snapshot = await getDocs(q);
    
    const blogs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Blog[];

    blogCache.set(cacheKey, blogs);
    return blogs;
  } catch (error: any) {
    console.error('Error fetching recent blogs:', error);
    // Fallback to regular fetch if orderBy fails
    const allBlogs = await fetchAllBlogs(limitCount);
    return allBlogs;
  }
});

/**
 * Manually invalidate cache (call this after blog updates/deletes)
 */
export function invalidateBlogCache(blogId?: string): void {
  if (blogId) {
    blogCache.invalidate(`blog:${blogId}`);
  }
  // Invalidate list caches when any blog changes
  blogCache.invalidate('blogs:all:unlimited');
  blogCache.invalidate('blogs:count');
}

/**
 * Clear all blog caches
 */
export function clearAllBlogCaches(): void {
  blogCache.invalidate();
}
