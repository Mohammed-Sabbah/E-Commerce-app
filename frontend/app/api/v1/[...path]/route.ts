import { NextRequest, NextResponse } from 'next/server';

const API = process.env.API_URL;

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    const search = req.nextUrl.search;
    const res = await fetch(`${API}/api/v1/${path.join('/')}${search}`, {
        headers: { Cookie: req.headers.get('cookie') || '' },
    });
    const data = await res.json();
    const response = NextResponse.json(data, { status: res.status });
    const cookie = res.headers.get('set-cookie');
    if (cookie) response.headers.set('set-cookie', cookie);
    return response;
}

// ✅ إصلاح: يدعم الآن multipart/form-data (رفع الصور) وJSON
export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    const contentType = req.headers.get('content-type') || '';

    let body: BodyInit;
    const headers: HeadersInit = { Cookie: req.headers.get('cookie') || '' };

    if (contentType.includes('multipart/form-data')) {
        // pass-through as-is مع الحفاظ على الـ boundary
        body = await req.blob();
        headers['content-type'] = contentType;
    } else {
        body = await req.text();
        headers['content-type'] = 'application/json';
    }

    const res = await fetch(`${API}/api/v1/${path.join('/')}`, {
        method: 'POST',
        headers,
        body,
    });
    const data = await res.json();
    const response = NextResponse.json(data, { status: res.status });
    const cookie = res.headers.get('set-cookie');
    if (cookie) response.headers.set('set-cookie', cookie);
    return response;
}

// ✅ إصلاح: نفس الدعم على PATCH
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    const contentType = req.headers.get('content-type') || '';

    let body: BodyInit;
    const headers: HeadersInit = { Cookie: req.headers.get('cookie') || '' };

    if (contentType.includes('multipart/form-data')) {
        body = await req.blob();
        headers['content-type'] = contentType;
    } else {
        body = await req.text();
        headers['content-type'] = 'application/json';
    }

    const res = await fetch(`${API}/api/v1/${path.join('/')}`, {
        method: 'PATCH',
        headers,
        body,
    });
    const data = await res.json();
    const response = NextResponse.json(data, { status: res.status });
    const cookie = res.headers.get('set-cookie');
    if (cookie) response.headers.set('set-cookie', cookie);
    return response;
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    const res = await fetch(`${API}/api/v1/${path.join('/')}`, {
        method: 'DELETE',
        headers: { Cookie: req.headers.get('cookie') || '' },
    });
    const data = await res.json().catch(() => ({}));
    const response = NextResponse.json(data, { status: res.status });
    const cookie = res.headers.get('set-cookie');
    if (cookie) response.headers.set('set-cookie', cookie);
    return response;
}
