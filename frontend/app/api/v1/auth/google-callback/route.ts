import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const token = req.nextUrl.searchParams.get('token');
    const url = req.nextUrl.clone();

    if (!token) {
        url.pathname = '/login';
        url.search = '?error=oauth_failed';
        return NextResponse.redirect(url);
    }

    url.pathname = '/';
    url.search = '';
    const response = NextResponse.redirect(url);

    response.cookies.set('token', token, {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
    });

    return response;
}
