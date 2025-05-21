import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const url = request.nextUrl.clone(); // get a copy of the current Next URL object
    const key = url.searchParams.get('key'); // get the search param named 'key'
    
    if (key === process.env.CHANELLES_KEY) { // if that search param matches chanelle's key...
        url.searchParams.delete('key'); // remove it from the URL so it looks clean


        console.log('aoi');
        const response = NextResponse.rewrite(url) // build a new response and rewrite the URL without redirecting
        response.cookies.set('isChan', '1', { // set isChan cookie to 1
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60
        })
        return response;
    }

    return NextResponse.next(); // pass
}