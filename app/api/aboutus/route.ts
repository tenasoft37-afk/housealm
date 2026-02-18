import { NextResponse } from 'next/server';
import { getDb } from '@/libs/mongodb';

export const revalidate = 10;

export async function GET() {
    try {
        const db = await getDb();
        const collection = db.collection('AboutUs');

        // Fetch the most recent AboutUs entry
        const entry = await collection.findOne({}, { sort: { createdAt: -1 } });

        if (!entry) {
            return NextResponse.json(
                { error: 'No AboutUs data found' },
                { status: 404 }
            );
        }

        const transformedData = {
            id: entry._id.toString(),
            title: entry.title,
            image: entry.image,
            description: entry.description,
            createdAt: entry.createdAt,
            updatedAt: entry.updatedAt,
        };

        return NextResponse.json(transformedData);
    } catch (error) {
        console.error('Error fetching AboutUs data:', error);
        return NextResponse.json(
            {
                error: 'Failed to fetch AboutUs data',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
