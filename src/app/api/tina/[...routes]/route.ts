import { NextRequest, NextResponse } from "next/server";

// TinaCMS API route - TinaCMS handles this via its dev server
// The actual TinaCMS API runs on http://localhost:4001/graphql

export async function GET(
  request: NextRequest,
  { params }: { params: { routes: string[] } }
) {
  // Redirect TinaCMS API calls to the TinaCMS dev server
  const tinaUrl = `http://localhost:4001/${params.routes.join("/")}`;
  
  try {
    const response = await fetch(tinaUrl, {
      method: 'GET',
      headers: {
        ...Object.fromEntries(request.headers.entries()),
      },
    });
    
    const data = await response.text();
    return new NextResponse(data, {
      status: response.status,
      headers: response.headers,
    });
  } catch (error) {
    return NextResponse.json({ 
      error: "TinaCMS dev server not available",
      message: "Make sure TinaCMS dev server is running on port 4001"
    }, { status: 503 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { routes: string[] } }
) {
  // Redirect TinaCMS API calls to the TinaCMS dev server
  const tinaUrl = `http://localhost:4001/${params.routes.join("/")}`;
  
  try {
    const body = await request.text();
    const response = await fetch(tinaUrl, {
      method: 'POST',
      headers: {
        ...Object.fromEntries(request.headers.entries()),
      },
      body,
    });
    
    const data = await response.text();
    return new NextResponse(data, {
      status: response.status,
      headers: response.headers,
    });
  } catch (error) {
    return NextResponse.json({ 
      error: "TinaCMS dev server not available",
      message: "Make sure TinaCMS dev server is running on port 4001"
    }, { status: 503 });
  }
}
