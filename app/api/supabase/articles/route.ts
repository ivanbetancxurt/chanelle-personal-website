import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!); // initialize supabase client


export async function GET() {
    try {
        const articles = await prisma.articles.findMany(); // get all articles
        return NextResponse.json(articles);
    } catch(err) {
        console.error('GET /api/supabase/articles error: ', err); // log the error...
        return NextResponse.json({ // ...and return it as a json
            error: err || 'Unknown error' 
        });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { // get the article to be uploaded from request...
            link,
            title,
            organization,
            date,
            thumbnail,
            thumbnailDescription
        } = await request.json(); 

        const newArticle = await prisma.articles.create({ // ...and upload it
            data: {
                link,
                title,
                organization,
                date,
                thumbnail,
                thumbnailDescription
            }
        });

        return NextResponse.json(newArticle);
    } catch(err) {
        console.error('POST /api/supabase/articles error: ', err); // log the error...
        return NextResponse.json({ // ...and return it as a json
            error: err || 'Unknown error' 
        });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { link } = await request.json(); // get link of provided article

        if (!link) {
            return NextResponse.json({ 
                error: 'No article link provided for deletion.' 
            });
        }

        const articleToDelete = await prisma.articles.findUnique({ // get the article that will be deleted
            where: { link }
        });

        if (!articleToDelete) {
            return NextResponse.json({ 
                error: 'Article to delete not found' 
            });
        }

        // get the name of the thumbnail of this article
        const thumbnailUrl = articleToDelete.thumbnail;
        const pathMatch = thumbnailUrl.match(/\/thumbnails\/(.+)$/);
        const thumbnailName = pathMatch ? pathMatch[1] : null;

        // delete the article
        await prisma.articles.delete({
            where: { link }
        });
        
        // delete thumbnail from storage
        if (thumbnailName) {
            const { error: storageError } = await supabase.storage
                .from('thumbnails')
                .remove([thumbnailName]);

            if (storageError) {
                console.error('Error deleting thumbnail from storage:', storageError);
            }
        }

        return NextResponse.json({ 
            success: true, 
            message: 'Article deleted successfully' 
        });
    } catch(err) {
        console.error('DELETE /api/supabase/articles error: ', err); // log the error...
        return NextResponse.json({ // ...and return it as a json
            error: err || 'Unknown error' 
        });
    }
}