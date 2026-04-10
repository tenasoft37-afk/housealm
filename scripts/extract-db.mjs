import { MongoClient } from 'mongodb';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const DATABASE_URL = 'mongodb+srv://adammagen1212:Zayana221@cluster0.9lwcs3k.mongodb.net/houseofalmas';
const DB_NAME = 'houseofalmas';
const OUTPUT_DIR = join(__dirname, '..', 'db-export');

async function extractAll() {
  let client;
  try {
    console.log('Connecting to MongoDB...');
    client = new MongoClient(DATABASE_URL, {
      tls: true,
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
      socketTimeoutMS: 30000,
    });
    await client.connect();
    console.log('Connected.');

    const db = client.db(DB_NAME);
    const collections = await db.listCollections().toArray();

    if (collections.length === 0) {
      console.log('No collections found in database.');
      return;
    }

    mkdirSync(OUTPUT_DIR, { recursive: true });

    console.log(`Found ${collections.length} collection(s): ${collections.map(c => c.name).join(', ')}\n`);

    for (const col of collections) {
      const name = col.name;
      const docs = await db.collection(name).find({}).toArray();
      const filePath = join(OUTPUT_DIR, `${name}.json`);
      writeFileSync(filePath, JSON.stringify(docs, null, 2), 'utf-8');
      console.log(`  [${name}] — ${docs.length} document(s) saved to db-export/${name}.json`);
    }

    console.log('\nExport complete.');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    if (client) await client.close();
  }
}

extractAll();
