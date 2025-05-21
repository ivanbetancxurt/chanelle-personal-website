import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
    const store = await cookies(); // get all cookies
    const isChan = store.get('isChan')?.value === '1'; // get boolean value for whether this is Chan
    return NextResponse.json({ isChan }); // return { 'isChan': true }
}