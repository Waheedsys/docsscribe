require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const { scrapeAndSaveGuide, normalize } = require('./utils/guideService');
const { initCronJobs } = require('./utils/cronJobs');


const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('Error: MONGO_URI environment variable is not set.');
  process.exit(1);
}

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for large payloads

let client;
let db;

async function connectDB() {
  try {
    client = new MongoClient(MONGO_URI);
    await client.connect();
    db = client.db('userguide');
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  }
}

// Ensure DB is connected before handling requests
connectDB().then(() => {
  // Initialize cron jobs after DB connection
  initCronJobs(db);
});

// Health check
// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Ported from questions.js
app.post('/api/questions', async (req, res) => {
  try {
    const scrapedDocs = req.body;
    
    if (!Array.isArray(scrapedDocs)) {
      return res.status(400).json({ error: 'Input must be an array of questions' });
    }

    const col = db.collection('questions');

    const ops = scrapedDocs.map(d => ({
      updateOne: {
        filter: { link: d.link },
        update: {
          $set: {
            title: d.title,
            source: d.source || 'scribehow',
            contentType: d.contentType || 'HTML',
            updatedAt: new Date(),
            normalizedTitle: normalize(d.title)
          },
          $setOnInsert: { scrapedAt: new Date() }
        },
        upsert: true
      }
    }));

    if (ops.length > 0) {
      await col.bulkWrite(ops);
    }
    
    res.json({ message: 'Questions updated successfully', count: ops.length });
  } catch (err) {
    console.error('Error in /api/questions:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

// Ported from guides.js
app.post('/api/guides', async (req, res) => {
  try {
    const { guideName, ordering } = req.body;

    if (!guideName || !Array.isArray(ordering)) {
      return res.status(400).json({ error: 'Invalid input. storage requires "guideName" (string) and "ordering" (array).' });
    }

    const guidesCol = db.collection('guides');

    // Convert children strings -> objects with normalizedLabel
    // Based on logic in guides.js
    const formattedOrdering = ordering.map(section => ({
      heading: section.heading,
      children: (section.children || []).map(label => {
        // If the input is just a string (as in the script example), process it.
        // If it's already an object, maybe we should just use it? 
        // The script assumed strings: "children": ["Title 1", "Title 2"]
        // We'll support both for flexibility, but prioritize the script logic.
        const labelText = typeof label === 'string' ? label : (label.label || '');
        
        return {
          label: labelText,
          label: labelText,
          normalizedLabel: normalize(labelText),
          // Preserve other properties if it was an object and we wish to (optional)
          ...((typeof label === 'object') ? label : {}) 
        };
      })
    }));

    const doc = {
      name: guideName,
      ordering: formattedOrdering,
      status: true,
      dateCreated: new Date()
    };

    // Upsert by name
    await guidesCol.updateOne({ name: guideName }, { $set: doc }, { upsert: true });

    // --- Process the guide immediately ---
    console.log(`Guide "${guideName}" updated. Starting processing...`);
    // We can await this or run it in background. Awaiting is safer for now to confirm it works.
    const { processGuide } = require('./utils/guideProcessor');
    await processGuide(db, guideName);

    res.json({ message: 'Guide updated and processed successfully', guideName });
  } catch (err) {
    console.error('Error in /api/guides:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

app.post('/api/full-guide-data', async (req, res) => {
  try {
    const { guideName, locale, icon, questions, ordering } = req.body;

    if (!guideName) {
      return res.status(400).json({ error: 'Guide Name is required.' });
    }

    let questionsCount = 0;

    // 1. Process Questions if provided
    if (questions && Array.isArray(questions) && questions.length > 0) {
      const col = db.collection('questions');
      const ops = questions.map(d => ({
        updateOne: {
          filter: { link: d.link },
          update: {
            $set: {
              title: d.title,
              source: d.source || 'scribehow',
              contentType: d.contentType || 'HTML',
              updatedAt: new Date(),
              normalizedTitle: normalize(d.title)
            },
            $setOnInsert: { scrapedAt: new Date() }
          },
          upsert: true
        }
      }));

      if (ops.length > 0) {
        await col.bulkWrite(ops);
        questionsCount = ops.length;
      }
    }

    // 2. Process Guide Ordering if provided
    if (ordering && Array.isArray(ordering) && ordering.length > 0) {
      const guidesCol = db.collection('guides');

      // Convert children strings -> objects with normalizedLabel
      const formattedOrdering = ordering.map(section => ({
        heading: section.heading,
        children: (section.children || []).map(label => {
          const labelText = typeof label === 'string' ? label : (label.label || '');
          return {
            label: labelText,
            normalizedLabel: normalize(labelText),
            label: labelText,
            normalizedLabel: normalize(labelText),
            ...((typeof label === 'object') ? label : {})
          };
        })
      }));

      const doc = {
        name: guideName,
        locale: locale || null, // Add locale
        icon: icon || null,     // Add icon
        ordering: formattedOrdering,
        status: true,
        dateCreated: new Date()
      };

      // Upsert by name
      await guidesCol.updateOne({ name: guideName }, { $set: doc }, { upsert: true });

      // --- Process the guide immediately ---
      console.log(`Guide "${guideName}" updated via full-data endpoint. Starting processing...`);
      const { processGuide } = require('./utils/guideProcessor');
      await processGuide(db, guideName);
    }

    res.json({
      message: 'Data processed successfully',
      guideName,
      questionsProcessed: questionsCount,
      guideProcessed: !!ordering
    });

  } catch (err) {
    console.error('Error in /api/full-guide-data:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});


const { processGuide } = require('./utils/guideProcessor');

app.post('/api/scrape-and-process', async (req, res) => {
  try {
    const { url, locale, icon } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required.' });
    }

    const result = await scrapeAndSaveGuide(db, url, locale, icon);

    res.json({
      message: 'Scraping and processing completed successfully',
      ...result
    });

  } catch (err) {
    console.error('Error in /api/scrape-and-process:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message || err });
  }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
