import { MongoClient } from 'mongodb';

const NEW_DB_URL = 'mongodb+srv://adammagen1212:Zayana221@cluster0.v9fq4pa.mongodb.net/houseofalmas1';

async function run() {
  const client = new MongoClient(NEW_DB_URL);
  await client.connect();
  const db = client.db('houseofalmas1');
  const result = await db.collection('Product').updateMany({}, { $set: { isFeatured: true } });
  console.log('Updated:', result.modifiedCount, 'products set to isFeatured: true');
  await client.close();
}

run().catch(e => { console.error(e.message); process.exit(1); });
