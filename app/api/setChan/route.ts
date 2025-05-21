import { NextResponse } from 'next/server';

// sets isChan cookie to 1
export async function POST() {
    const response = NextResponse.json({'success': true}); // build a new response with a success json
    response.cookies.set('isChan', '1', { // set isChan cookie to 1
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60
    });
    return response;
}

// clears isChan cookie
export async function DELETE() {
    const response = NextResponse.json({'success': true}); // build a new response with a success json
    response.cookies.set('isChan', '0', { // set isChan cookie to 0 and make it expire immediately
        httpOnly: true,
        maxAge: 0
    });
    return response;
}