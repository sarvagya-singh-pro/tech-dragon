// lib/blogService.ts
// Direct client-side Firestore queries

import { db } from '@/lib/firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  query, 
  limit, 
  orderBy,
  where,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData
} from 'firebase/firestore';

export interface Blog {
  id: string;
  content: string;
  char_count: number;
  title?: string;
  author?: string;
  createdAt?: any;
  updatedAt?: any;
  tags?: string[];
  [key: string]: any;
}

/**
 * Fetch all blogs from Firestore
 * @param limitCount - Optional limit on number of blogs to fetch
 * @returns Array of Blog objects
 */
export async function fetchAllBlogs(limitCount?: number): Promise<Blog[]> {
  try {
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

    return blogs;
  } catch (error: any) {
    console.error('Error fetching blogs:', error);
    throw new Error(`Failed to fetch blogs: ${error.message}`);
  }
}

/**
 * Fetch a single blog by ID
 * @param id - Blog document ID
 * @returns Blog object or null if not found
 */
export async function fetchBlogById(id: string): Promise<Blog | null> {
  try {
    const blogRef = doc(db, 'blogs', id);
    const blogSnap = await getDoc(blogRef);

    if (!blogSnap.exists()) {
      return null;
    }

    return {
      id: blogSnap.id,
      ...blogSnap.data(),
    } as Blog;
  } catch (error: any) {
    console.error('Error fetching blog:', error);
    throw new Error(`Failed to fetch blog: ${error.message}`);
  }
}

/**
 * Search blogs by keyword in content or title
 * @param keyword - Search term
 * @returns Array of matching Blog objects
 */
export async function searchBlogs(keyword: string): Promise<Blog[]> {
  try {
    const blogsRef = collection(db, 'blogs');
    const snapshot = await getDocs(blogsRef);
    
    const blogs = snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Blog[];
    
    // Client-side filtering (Firestore doesn't support full-text search natively)
    const filtered = blogs.filter(blog => {
      const searchLower = keyword.toLowerCase();
      return (
        blog.content?.toLowerCase().includes(searchLower) ||
        blog.title?.toLowerCase().includes(searchLower) ||
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
 * Fetch blogs with pagination
 * @param limitCount - Number of blogs per page
 * @param lastDoc - Last document from previous page (for pagination)
 * @returns Object with blogs array and last document
 */
export async function fetchBlogsWithPagination(
  limitCount: number = 10,
  lastDoc?: QueryDocumentSnapshot<DocumentData>
): Promise<{ blogs: Blog[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> {
  try {
    const blogsRef = collection(db, 'blogs');
    let q = query(blogsRef, limit(limitCount));
    
    if (lastDoc) {
      q = query(blogsRef, startAfter(lastDoc), limit(limitCount));
    }

    const snapshot = await getDocs(q);
    
    const blogs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Blog[];

    const lastVisible = snapshot.docs[snapshot.docs.length - 1] || null;

    return {
      blogs,
      lastDoc: lastVisible,
    };
  } catch (error: any) {
    console.error('Error fetching blogs with pagination:', error);
    throw new Error(`Failed to fetch blogs: ${error.message}`);
  }
}

/**
 * Get total count of blogs
 * @returns Number of total blogs
 */
export async function getBlogCount(): Promise<number> {
  try {
    const blogsRef = collection(db, 'blogs');
    const snapshot = await getDocs(blogsRef);
    return snapshot.size;
  } catch (error: any) {
    console.error('Error getting blog count:', error);
    throw new Error(`Failed to get blog count: ${error.message}`);
  }
}

/**
 * Fetch recent blogs (if createdAt field exists)
 * @param limitCount - Number of blogs to fetch
 * @returns Array of recent Blog objects
 */
export async function fetchRecentBlogs(limitCount: number = 5): Promise<Blog[]> {
  try {
    const blogsRef = collection(db, 'blogs');
    // Note: This requires createdAt field and a Firestore index
    const q = query(blogsRef, orderBy('createdAt', 'desc'), limit(limitCount));

    const snapshot = await getDocs(q);
    
    const blogs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Blog[];

    return blogs;
  } catch (error: any) {
    console.error('Error fetching recent blogs:', error);
    // Fallback to regular fetch if orderBy fails (missing field or index)
    return fetchAllBlogs(limitCount);
  }
}