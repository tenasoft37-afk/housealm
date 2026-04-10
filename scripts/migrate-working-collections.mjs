import { MongoClient, ObjectId } from 'mongodb';

const NEW_DB_URL = 'mongodb+srv://adammagen1212:Zayana221@cluster0.v9fq4pa.mongodb.net/houseofalmas1';
const BASE_URL = 'https://www.houseofalmas.co';

// Map: collection name -> live API endpoint
const SOURCES = [
  { collection: 'HouseofAlmasCategory', endpoint: '/api/categories' },
  { collection: 'Hero',                 endpoint: '/api/hero' },
  { collection: 'AboutUs',              endpoint: '/api/aboutus' },
  { collection: 'Shopnow',              endpoint: '/api/shopnow' },
];

// Restore string IDs back to ObjectId so MongoDB structure is correct
function restoreDoc(doc) {
  const restored = { ...doc };
  if (typeof restored.id === 'string' && restored.id.length === 24) {
    restored._id = new ObjectId(restored.id);
  }
  delete restored.id;
  return restored;
}

async function migrate() {
  let client;
  try {
    console.log('Connecting to NEW database...');
    client = new MongoClient(NEW_DB_URL, {
      tls: true,
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
      socketTimeoutMS: 30000,
    });
    await client.connect();
    console.log('Connected.\n');

    const db = client.db('houseofalmas1');

    for (const { collection: collName, endpoint } of SOURCES) {
      console.log(`Fetching ${BASE_URL}${endpoint} ...`);
      const res = await fetch(`${BASE_URL}${endpoint}`);

      if (!res.ok) {
        console.log(`  [SKIP] ${endpoint} returned HTTP ${res.status}\n`);
        continue;
      }

      const raw = await res.json();
      // Some endpoints return an array, others a single object
      const items = Array.isArray(raw) ? raw : [raw];

      if (items.length === 0) {
        console.log(`  [SKIP] No data returned from ${endpoint}\n`);
        continue;
      }

      const docs = items.map(restoreDoc);

      // Clear existing data to avoid duplicates
      await db.collection(collName).deleteMany({});
      const result = await db.collection(collName).insertMany(docs);
      console.log(`  [OK] Inserted ${result.insertedCount} document(s) into ${collName}\n`);
    }

    console.log('Migration complete.');
  } catch (err) {
    console.error('Migration error:', err.message);
    process.exit(1);
  } finally {
    if (client) await client.close();
  }
}

migrate();
