import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    
    if (!projectId || !apiKey) {
      throw new Error('Missing Firebase configuration');
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '50';
    const orderBy = searchParams.get('orderBy') || 'timestamp';
    const orderDirection = searchParams.get('order') || 'DESCENDING';
    
    console.log('Fetching blogs from project:', projectId);
    
    // Use runQuery for advanced sorting/filtering
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery?key=${apiKey}`;
    
    const queryBody = {
      structuredQuery: {
        from: [
          {
            collectionId: 'blogs',
            allDescendants: false
          }
        ],
        orderBy: [
          {
            field: {
              fieldPath: orderBy
            },
            direction: orderDirection
          }
        ],
        limit: parseInt(limit)
      }
    };
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(queryBody),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Firestore API error:', data);
      throw new Error(data.error?.message || 'Failed to fetch blogs');
    }
    
    // Transform runQuery response
    const blogs = data
      .filter((item: any) => item.document) // Filter out empty responses
      .map((item: any) => {
        const doc = item.document;
        const id = doc.name.split('/').pop();
        const fields = doc.fields || {};
        
        const blogData: any = { id };
        for (const [key, value] of Object.entries(fields)) {
          const fieldValue = value as any;
          if (fieldValue.stringValue !== undefined) {
            blogData[key] = fieldValue.stringValue;
          } else if (fieldValue.integerValue !== undefined) {
            blogData[key] = parseInt(fieldValue.integerValue);
          } else if (fieldValue.doubleValue !== undefined) {
            blogData[key] = fieldValue.doubleValue;
          } else if (fieldValue.booleanValue !== undefined) {
            blogData[key] = fieldValue.booleanValue;
          } else if (fieldValue.timestampValue !== undefined) {
            blogData[key] = fieldValue.timestampValue;
          } else if (fieldValue.arrayValue) {
            blogData[key] = fieldValue.arrayValue.values?.map((v: any) => 
              v.stringValue || v.integerValue || v.doubleValue || v.booleanValue
            ) || [];
          }
        }
        
        return blogData;
      });

    console.log(`Successfully fetched ${blogs.length} blogs`);

    return NextResponse.json({
      success: true,
      data: blogs,
      count: blogs.length,
    });
  } catch (error: any) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch blogs',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
