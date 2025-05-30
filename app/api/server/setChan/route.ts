import { NextResponse } from 'next/server';

// sets isChan cookie to 1
export async function POST() {
    try {
        const response = NextResponse.json({'success': true}); // build a new response with a success json
        response.cookies.set('isChan', '1', { // set isChan cookie to 1
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/'
        });
        return response;
    } catch(err) {
        console.error('POST api/server/setChan error: ', err); // log the error...
        return NextResponse.json({ // ...and return it as a json
            error: err || 'Unknown error'
        });
    }
}

// clears isChan cookie
export async function DELETE() {
    try {
        const response = NextResponse.json({'success': true}); // build a new response with a success json
        response.cookies.set('isChan', '0', { // set isChan cookie to 0 and make it expire immediately
            httpOnly: true,
            maxAge: 0,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/'
        });
        return response;
    } catch(err) {
        console.error('DELETE api/server/setChan error: ', err); // log the error...
        return NextResponse.json({ // ...and return it as a json
            error: err || 'Unknown error'
        });
    }
}