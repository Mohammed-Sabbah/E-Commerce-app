import { NextRequest, NextResponse } from 'next/server';

const API = process.env.API_URL;

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
    const path = params.path.join('/');
    const search = req.nextUrl.search;
    const res = await fetch(`${API}/api/v1/${path}${search}`, {
        headers: { Cookie: req.headers.get('cookie') || '' },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}

export async function POST(req: NextRequest, { params }: { params: { path: string[] } }) {
    const path = params.path.join('/');
    const body = await req.json();
    const res = await fetch(`${API}/api/v1/${path}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Cookie: req.headers.get('cookie') || '',
        },
        body: JSON.stringify(body),
    });
    const data = await res.json();
    const response = NextResponse.json(data, { status: res.status });
    const cookie = res.headers.get('set-cookie');
    if (cookie) response.headers.set('set-cookie', cookie);
    return response;
}