import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// returns whether the current user is chanelle
export async function GET() {
    try {
        const store = await cookies(); // get all cookies
        const isChan = store.get('isChan')?.value === '1'; // get boolean value for whether this is chanelle

        return NextResponse.json({ isChan }); // return { 'isChan': true }
    } catch(err) {
        console.error('GET api/amChan error: ', err); // log the error...

        return NextResponse.json({ // ...and return it as a json
            error: err || 'Unknown error'
        });
    }
}