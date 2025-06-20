import { NextRequest, NextResponse } from "next/server";

// checks for the presence of 'key' search parameter and sets the isChan cookie if the value is correct
export function middleware(request: NextRequest) {
    const url = request.nextUrl.clone(); // get a copy of the current Next URL object
    const key = url.searchParams.get('key'); // get the search param named 'key'

    if (key === process.env.CHANELLES_KEY) { // if that search param matches chanelle's key...
        url.searchParams.delete('key'); // remove it from the URL so it looks clean

        const response = NextResponse.redirect(url) // build a new response and redirect to the URL
        response.cookies.set('isChan', '1', { // set isChan cookie to 1
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/'
        })
        return response;
    }

    return NextResponse.next(); // pass
}