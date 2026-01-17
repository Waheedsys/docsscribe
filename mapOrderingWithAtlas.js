require('dotenv').config();
const { MongoClient } = require('mongodb');
const { processGuide } = require('./utils/guideProcessor');

// ---------- CONFIG ----------
const MONGO_URI = process.env.MONGO_URI; // required
const DB_NAME = 'userguide';
// Default to the hardcoded one if not provided via args, 
// strictly to maintain backward compatibility with how the user might run it without args.
// But we allow passing it as an arg now too: node mapOrderingWithAtlas.js "Some Guide Name"
const GUIDE_NAME = process.argv[2] || 'Smart Audit - TOC'; 
// ----------------------------

if (!MONGO_URI) {
  console.error('Set MONGO_URI environment variable.');
  process.exit(1);
}

async function main() {
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    const db = client.db(DB_NAME);

    console.log(`Connected to DB. Starting processing for guide: "${GUIDE_NAME}"`);
    
    await processGuide(db, GUIDE_NAME);
    
    console.log('Done.');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.close();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
