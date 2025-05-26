import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Articles } from "./generated/prisma";
import ordinal from 'ordinal';
import {createClient } from '@supabase/supabase-js';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!); // export supabase client

// upload cover art to supabase storage bucket
export async function supabaseThumbnailUpload(bucket: string, fileName: string, file: File) {
    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);

    if (error) {
        alert(`Ah shi, sorry bae this isn't your fault! Take a picture of this for me and I'll try to fix it ASAP! <3 ~~~ ${error.message}`);
        throw new Error(`There was an issue uploading thumbnail to Supabase: ${error.message}`);
    }
    return data;
}

// after the thumbnail is uploaded, get its URL for storing in the Articles table
export function getURL(bucket: string, path: string) {
    const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);
    
    return data.publicUrl;
}

// determines if an article has been posted in the last 30 days
export function isNew(article: Articles) {
    const articleDateSplit = article.date.split(' '); // split article date into [month, day, year]
    
    // get day of article as a pure number ('23rd' => '23')
    const articleDayNum = [];
    for (const char of articleDateSplit[1]) {
        if (char.charCodeAt(0) >= '0'.charCodeAt(0) && char.charCodeAt(0) <= '9'.charCodeAt(0)) {
            articleDayNum.push(char);
        }
    }

    const naturalLangArticleDateStr = `${articleDateSplit[0]} ${articleDayNum.join('')}, ${articleDateSplit[2]} 00:00:00`; // natural language string format of article date to use .getMonth() later
    const date = new Date(naturalLangArticleDateStr); // article date in Date type

    let articleMonthNum = (date.getMonth() + 1).toString() // get article month number as string

    // add a 0 to the beginning of the day and month if they are singular digits for the ISO format
    if (articleDayNum.length === 1) {
        articleDayNum.unshift('0');
    }
    if (articleMonthNum.length === 1) {
        articleMonthNum = `0${articleMonthNum}`;
    }

    const articleISODate = `${articleDateSplit[2]}-${articleMonthNum}-${articleDayNum.join('')}T00:00:00Z`; // ISO format of article for parsing

    const thirtyDays = 2592000000; // 30 days in milliseconds

    return Date.parse(articleISODate) >= Date.now() - thirtyDays; // return true if the ariticle was posted within 30 days of today
}

// convert yyyy-mm-dd date format into 'month day, year'
export function yyyymmddToString(date: string): string {
    const [y, m, d] = date.split('-'); // get year month and day numbers

    // offset list of months so that months[1] = 'January'
    const months = ['', 'January', 'February', 'March', 'April',
        'May', 'June', 'July', 'August', 'September', 'November', 'December'
    ];

    return `${months[parseInt(m)]} ${ordinal(parseInt(d))}, ${y}`; // return in 'month day, year' format
}

// sort list of articles by newest first
export function sortArticles(articles: Articles[]) {
    const sortedArticles = articles.sort((a, b) => {
        // remove ordinal suffixes from days
        const cleanDateA = a.date.replace(/(\d+)(st|nd|rd|th)/g, '$1');
        const cleanDateB = b.date.replace(/(\d+)(st|nd|rd|th)/g, '$1');

        // get date objects from clean dates
        const dateA = new Date(cleanDateA);
        const dateB = new Date(cleanDateB);

        return dateB.getTime() - dateA.getTime(); // newest first;
    });

    return sortedArticles;
}