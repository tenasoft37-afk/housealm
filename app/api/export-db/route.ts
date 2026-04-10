import { NextResponse } from 'next/server';
import { getDb } from '@/libs/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = await getDb();
    const collections = await db.listCollections().toArray();

    const exportData: Record<string, any[]> = {};

    for (const col of collections) {
      const docs = await db.collection(col.name).find({}).toArray();
      exportData[col.name] = docs;
    }

    return NextResponse.json(exportData, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
