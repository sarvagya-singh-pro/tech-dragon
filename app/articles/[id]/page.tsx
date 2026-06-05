"use client"
import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { Loader2, ArrowLeft, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchBlogById, Blog } from '@/lib/blogService';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/ui/footer';

// ─── Styles ─────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;1,8..60,300;1,8..60,400&family=DM+Sans:wght@300;400;500&display=swap');

  .article-root {
    background: #000;
    color: #fff;
    font-family: 'Source Serif 4', Georgia, serif;
    min-height: 100vh;
  }

  /* Progress bar */
  .read-progress {
    position: fixed;
    top: 0; left: 0;
    height: 2px;
    background: #fff;
    z-index: 9999;
    transition: width 120ms ease-out;
  }

  /* Back button */
  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: .08em;
    text-transform: uppercase;
    color: #888;
    border: 1px solid #333;
    border-radius: 2px;
    padding: 8px 16px;
    background: transparent;
    cursor: pointer;
    text-decoration: none;
    transition: color .2s, border-color .2s;
  }
  .back-btn:hover { color: #fff; border-color: #fff; }

  /* Layout */
  .article-outer {
    max-width: 760px;
    margin: 0 auto;
    padding: 48px 24px 0;
  }

  /* Category */
  .article-category {
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: .16em;
    text-transform: uppercase;
    color: #888;
    margin-bottom: 18px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .article-category::before {
    content: '';
    display: inline-block;
    width: 20px; height: 1px;
    background: #555;
  }

  /* Title */
  .article-title {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(2rem, 5vw, 3.2rem);
    font-weight: 900;
    line-height: 1.13;
    color: #fff;
    margin: 0 0 32px;
    letter-spacing: -.01em;
  }

  /* Rule */
  .title-rule {
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 28px;
  }
  .title-rule span { height: 1px; flex: 1; background: #222; }
  .title-rule em { font-style: normal; font-size: 14px; color: #444; }

  /* Meta */
  .article-meta {
    display: flex; flex-wrap: wrap; gap: 20px; align-items: center;
    padding: 14px 0;
    border-top: 1px solid #222;
    border-bottom: 1px solid #222;
    margin-bottom: 44px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    color: #666;
  }
  .article-meta-item { display: flex; align-items: center; gap: 6px; }
  .article-meta-tag {
    background: #111; border: 1px solid #333; border-radius: 2px;
    padding: 3px 10px; font-size: 11px; letter-spacing: .05em; color: #888;
  }

  /* Hero image */
  .hero-image-wrap {
    position: relative; width: 100%; aspect-ratio: 16/9;
    margin-bottom: 12px; overflow: hidden; border-radius: 2px;
  }
  .hero-caption {
    font-family: 'DM Sans', sans-serif; font-size: 12px; color: #555;
    margin-bottom: 44px; padding: 8px 0 0 12px;
    border-left: 2px solid #222; font-style: italic;
  }

  /* Drop cap */
  .article-body > p:first-child::first-letter {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 5em; font-weight: 900;
    float: left; line-height: .8;
    margin: 8px 12px -4px 0;
    color: #fff;
  }

  /* Body paragraphs */
  .article-body p {
    font-family: 'Source Serif 4', Georgia, serif;
    font-size: 1.1rem;
    line-height: 1.88;
    color: #ccc;
    margin: 0 0 1.6em;
    font-weight: 300;
  }

  /* Pull quote */
  .pull-quote {
    margin: 44px 0;
    padding: 28px 32px;
    border-left: 3px solid #fff;
    position: relative;
  }
  .pull-quote p {
    font-family: 'Playfair Display', Georgia, serif !important;
    font-size: 1.35rem !important;
    font-weight: 400 !important;
    font-style: italic;
    line-height: 1.5 !important;
    color: #fff !important;
    margin: 0 !important;
  }

  /* Section divider */
  .section-divider {
    display: flex; align-items: center; gap: 16px; margin: 44px 0;
  }
  .section-divider span { height: 1px; flex: 1; background: #222; }
  .section-divider em { font-style: normal; font-size: 12px; color: #444; letter-spacing: .2em; }

  /* ── Inline images ── */
  /* full width (default) */
  .blog-img-wrap {
    margin: 36px 0;
    border-radius: 2px;
    overflow: hidden;
  }
  .blog-img-wrap.size-full {
    width: 100%;
  }
  .blog-img-wrap.size-full .blog-img-inner {
    position: relative; width: 100%; aspect-ratio: 16/9;
  }
  /* float right */
  .blog-img-wrap.size-right {
    float: right;
    width: 46%;
    margin: 4px 0 24px 32px;
    clear: right;
  }
  .blog-img-wrap.size-right .blog-img-inner {
    position: relative; width: 100%; aspect-ratio: 4/3;
  }
  /* float left */
  .blog-img-wrap.size-left {
    float: left;
    width: 46%;
    margin: 4px 32px 24px 0;
    clear: left;
  }
  .blog-img-wrap.size-left .blog-img-inner {
    position: relative; width: 100%; aspect-ratio: 4/3;
  }

  .blog-img-caption {
    font-family: 'DM Sans', sans-serif; font-size: 11px;
    color: #555; padding: 8px 10px; border-top: 1px solid #1a1a1a;
    background: #080808; font-style: italic;
  }

  .clearfix::after { content: ''; display: table; clear: both; }

  /* End rule */
  .article-end-rule {
    margin: 64px 0 0;
    display: flex; align-items: center; gap: 12px;
  }
  .article-end-rule span { height: 1px; flex: 1; background: #222; }
  .article-end-rule em { font-style: normal; color: #333; font-size: 12px; letter-spacing: .2em; }

  /* States */
  .state-center {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; min-height: 60vh; gap: 12px;
    font-family: 'DM Sans', sans-serif; color: #666;
  }
  .error-card {
    max-width: 520px; margin: 80px auto; padding: 40px;
    background: #0a0a0a; border: 1px solid #222; border-radius: 2px;
    font-family: 'DM Sans', sans-serif;
  }

  @media (max-width: 600px) {
    .blog-img-wrap.size-right,
    .blog-img-wrap.size-left {
      float: none; width: 100%; margin: 24px 0;
    }
  }
`;

// ─── Types ───────────────────────────────────────────────────────────────────

/**
 * BlogImage — add an `images` array to your Firestore blog document:
 *
 * images: [
 *   { url: "https://...", alt: "Caption text", afterParagraph: 2, size: "full" },
 *   { url: "https://...", alt: "Side note",    afterParagraph: 5, size: "right" },
 *   { url: "https://...", alt: "Another",      afterParagraph: 9, size: "left"  },
 * ]
 *
 * - afterParagraph: 0-based paragraph index AFTER which the image appears
 * - size: "full" | "right" | "left"
 */
interface BlogImage {
  url: string;
  alt?: string;
  afterParagraph: number;   // insert after this paragraph index (0-based)
  size?: 'full' | 'right' | 'left';
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function readingTime(content: string) {
  return `${Math.ceil(content.trim().split(/\s+/).length / 200)} min read`;
}

function splitParagraphs(content: string): string[] {
  const clean = content.replace(/\s+/g, ' ').trim();
  const sentences = clean.split(/(?<=[.?!])\s+/);
  const out: string[] = [];
  let cur = '', count = 0, seed = 54321;
  const rng = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  const next = () => [80, 100, 130, 60, 170, 110, 150][Math.floor(rng() * 7)];
  let target = next();
  for (const s of sentences) {
    cur += s + ' '; count += s.split(' ').length;
    if (count >= target) { out.push(cur.trim()); cur = ''; count = 0; target = next(); }
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ArticlePage() {
  const params = useParams();
  const id = params.id as string;

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      setScrollProgress(Math.min((window.scrollY / (doc.scrollHeight - window.innerHeight)) * 100, 100));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        const timeout = new Promise<never>((_, r) => setTimeout(() => r(new Error('Request timeout')), 10000));
        const data = await Promise.race([fetchBlogById(id), timeout]) as Blog;
        setBlog(data); setError(null);
      } catch (e: any) { setError(e.message); }
      finally { setLoading(false); }
    })();
  }, [id]);

  // Stable paragraph split — only recomputes when the raw content string changes.
  // Kept isolated so image updates never retrigger this and cause paragraph jitter.
  const paragraphs = useMemo(
    () => (blog?.content ? splitParagraphs(blog.content) : []),
    [blog?.content]  // eslint-disable-line react-hooks/exhaustive-deps
  );

  // Image map — recomputes only when images change, never touches paragraphs.
  const imageMap = useMemo(() => {
    const rawImages: BlogImage[] =
      (blog as any)?.images?.length > 0
        ? (blog as any).images
        : blog?.image?.url
          ? [{ url: blog.image.url, alt: blog.image.alt_text, afterParagraph: 2, size: 'full' as const }]
          : [];
    const map = new Map<number, BlogImage[]>();
    for (const img of rawImages) {
      const idx = Math.max(0, img.afterParagraph ?? 0);
      if (!map.has(idx)) map.set(idx, []);
      map.get(idx)!.push(img);
    }
    return map;
  }, [(blog as any)?.images, blog?.image]);  // eslint-disable-line react-hooks/exhaustive-deps

  // Rendered body — combines stable paragraphs with image map.
  // Paragraph nodes keep identical keys across renders so React never
  // unmounts/remounts them when only images change — eliminating jitter.
  const renderedBody = useMemo(() => {
    if (!paragraphs.length) return null;
    const nodes: React.ReactNode[] = [];

    paragraphs.forEach((para, i) => {
      // Section divider every 6 paragraphs
      if (i > 0 && i % 6 === 0) {
        nodes.push(
          <div key={`div-${i}`} className="section-divider">
            <span /><em>· · ·</em><span />
          </div>
        );
      }

      // Pull quote every 9 paragraphs
      if (i > 0 && i % 9 === 0) {
        const sentence = para.split(/[.!?]/)[0];
        if (sentence.length > 40) {
          nodes.push(
            <div key={`pq-${i}`} className="pull-quote">
              <p>{sentence}.</p>
            </div>
          );
        }
      }

      // Paragraph — key is index-only, never changes between renders
      nodes.push(<p key={`p-${i}`}>{para}</p>);

      // Images after this paragraph
      const imgs = imageMap.get(i);
      if (imgs) {
        imgs.forEach((img, j) => {
          const size = img.size ?? 'full';
          nodes.push(
            <div key={`img-${i}-${j}`} className={`blog-img-wrap size-${size}`}>
              <div className="blog-img-inner">
                <Image
                  src={img.url}
                  alt={img.alt || ''}
                  fill
                  className="object-cover"
                  sizes={size === 'full' ? '(max-width:760px) 100vw, 760px' : '(max-width:600px) 100vw, 46vw'}
                />
              </div>
              {img.alt && <div className="blog-img-caption">{img.alt}</div>}
            </div>
          );
        });
      }
    });

    return nodes;
  }, [paragraphs, imageMap]);

  return (
    <div className="article-root">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="read-progress" style={{ width: `${scrollProgress}%` }} />

      <Navbar />

      {/* Loading */}
      {loading && (
        <div className="state-center">
          <Loader2 size={24} className="animate-spin" style={{ color: '#fff' }} />
          <span style={{ fontSize: 13 }}>Loading article…</span>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="error-card">
          <p style={{ color: '#fff', marginBottom: 10, fontWeight: 600 }}>Couldn't load this article</p>
          <p style={{ color: '#666', fontSize: 13, marginBottom: 24 }}>{error}</p>
          <Link href="/articles" className="back-btn"><ArrowLeft size={13} /> Back to Articles</Link>
        </div>
      )}

      {/* Article */}
      {!loading && !error && blog && (
        <article className="article-outer">
          <div style={{ marginBottom: 40 }}>
            <Link href="/articles" className="back-btn"><ArrowLeft size={13} /> All Articles</Link>
          </div>

          {blog.search_keywords && (
            <div className="article-category">{blog.search_keywords}</div>
          )}

          <h1 className="article-title">
            {blog.enhanced_title || `Article ${blog.id.substring(0, 8)}`}
          </h1>

          <div className="title-rule"><span /><em>◆</em><span /></div>

          <div className="article-meta">
            {blog.date_created && (
              <div className="article-meta-item"><Calendar size={12} /><span>{blog.date_created}</span></div>
            )}
            {blog.content && (
              <div className="article-meta-item"><Clock size={12} /><span>{readingTime(blog.content)}</span></div>
            )}
            {blog.search_keywords && (
              <span className="article-meta-tag">{blog.search_keywords}</span>
            )}
          </div>

          {/* Hero image — only shown if no images array (legacy) */}
          {blog.image?.url && !(blog as any).images?.length && (
            <>
              <div className="hero-image-wrap">
                <Image
                  src={blog.image.url}
                  alt={blog.image.alt_text || blog.enhanced_title || ''}
                  fill className="object-cover" priority
                  sizes="(max-width:760px) 100vw, 760px"
                />
              </div>
              {blog.image.alt_text && <p className="hero-caption">{blog.image.alt_text}</p>}
            </>
          )}

          <div className="article-body clearfix">
            {blog.content
              ? renderedBody
              : <p style={{ color: '#555', fontStyle: 'italic' }}>No content available.</p>
            }
          </div>

          <div className="article-end-rule"><span /><em>◆</em><span /></div>

          <Footer />
        </article>
      )}

      {/* Not found */}
      {!loading && !error && !blog && (
        <div className="state-center">
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '2rem', color: '#fff' }}>Article Not Found</h2>
          <p style={{ color: '#555', maxWidth: 380, textAlign: 'center' }}>
            This article doesn't exist or has been removed.
          </p>
          <Link href="/articles" className="back-btn" style={{ marginTop: 8 }}>
            <ArrowLeft size={13} /> Browse All Articles
          </Link>
        </div>
      )}
    </div>
  );
}