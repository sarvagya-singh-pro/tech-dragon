import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

    if (!projectId || !apiKey) {
      throw new Error('Missing Firebase configuration');
    }

    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '50';
    const orderBy = searchParams.get('orderBy') || 'timestamp';
    const orderDirection = searchParams.get('order') || 'DESCENDING';

    console.log('Fetching blogs from project:', projectId);

    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery?key=${apiKey}`;

    const queryBody = {
      structuredQuery: {
        from: [{ collectionId: 'blogs', allDescendants: false }],
        orderBy: [{ field: { fieldPath: orderBy }, direction: orderDirection }],
        limit: parseInt(limit),
      },
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(queryBody),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Firestore API error:', data);
      throw new Error(data.error?.message || 'Failed to fetch blogs');
    }

    const blogs = data
      .filter((item: any) => item.document)
      .map((item: any) => {
        const doc = item.document;
        const id = doc.name.split('/').pop();
        const fields = doc.fields || {};

        const blogData: any = { id };

        for (const [key, value] of Object.entries(fields)) {
          blogData[key] = parseFirestoreValue(value);
        }

        return blogData;
      });

    console.log(`Successfully fetched ${blogs.length} blogs`);

    return NextResponse.json({ success: true, data: blogs, count: blogs.length });
  } catch (error: any) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch blogs', error: error.message },
      { status: 500 }
    );
  }
}

// ─── Firestore value parser ───────────────────────────────────────────────────

/**
 * Recursively parses any Firestore field value into a plain JS value.
 * Handles: string, integer, double, boolean, timestamp, array, map.
 *
 * For the blog page, the `images` field should be stored in Firestore as an
 * array of maps, e.g.:
 *
 *   images: [
 *     {
 *       url:            "https://example.com/photo.jpg",
 *       alt:            "Caption text",
 *       afterParagraph: 2,      ← integerValue
 *       size:           "full"  ← "full" | "right" | "left"
 *     },
 *     ...
 *   ]
 *
 * The `image` field (legacy single hero image) is stored as a map:
 *   image: { url: "...", alt_text: "..." }
 */
function parseFirestoreValue(value: any): any {
  if (value.stringValue !== undefined)    return value.stringValue;
  if (value.integerValue !== undefined)   return parseInt(value.integerValue);
  if (value.doubleValue !== undefined)    return value.doubleValue;
  if (value.booleanValue !== undefined)   return value.booleanValue;
  if (value.timestampValue !== undefined) return value.timestampValue;
  if (value.nullValue !== undefined)      return null;

  // Array — recurse into each element
  if (value.arrayValue) {
    return (value.arrayValue.values ?? []).map(parseFirestoreValue);
  }

  // Map — recurse into each field (handles nested objects like `image` or each item in `images`)
  if (value.mapValue) {
    const result: Record<string, any> = {};
    for (const [k, v] of Object.entries(value.mapValue.fields ?? {})) {
      result[k] = parseFirestoreValue(v);
    }
    return result;
  }

  return null;
}