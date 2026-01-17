const { scrapeScribeHow } = require('./scraper');
const { processGuide } = require('./guideProcessor');

function normalize(s) {
    return (s || '')
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * Scrapes a ScribeHow URL and updates the database with the questions and guide structure.
 * @param {import('mongodb').Db} db 
 * @param {string} url 
 * @param {string} [locale]
 * @param {string} [icon]
 */
async function scrapeAndSaveGuide(db, url, locale, icon) {
    console.log(`Processing scraping request for: ${url}`);

    // 1. Scrape the data
    const scrapedData = await scrapeScribeHow(url);
    const { guideName, questions, flatItems } = scrapedData;

    // Validate scraped data before saving
    if (!guideName || !questions || questions.length === 0) {
        throw new Error('No valid guide data found. Please check the URL.');
    }

    // Reconstruction of ordering from flatItems
    let ordering = [];
    if (flatItems && Array.isArray(flatItems)) {
        let currentSub = null;
        flatItems.forEach(item => {
            if (item.type === 'heading') {
                currentSub = { heading: item.text, children: [] };
                ordering.push(currentSub);
            } else if (item.type === 'link') {
                if (!currentSub) {
                    currentSub = { heading: 'General', children: [] };
                    ordering.push(currentSub);
                }
                currentSub.children.push({
                    label: item.text,
                    link: item.link
                });
            }
        });
    }

    let questionsCount = 0;

    // 2. Process Questions
    if (questions && Array.isArray(questions) && questions.length > 0) {
        const col = db.collection('questions');
        const ops = questions.map(d => ({
            updateOne: {
                filter: { link: d.link },
                update: {
                    $set: {
                        title: d.title,
                        source: 'scribehow',
                        contentType: 'HTML',
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

    // 3. Process Guide Ordering
    if (ordering && Array.isArray(ordering) && ordering.length > 0) {
        const guidesCol = db.collection('guides');

        const formattedOrdering = ordering.map(section => ({
            heading: section.heading,
            children: (section.children || []).map(label => {
                const labelText = typeof label === 'string' ? label : (label.label || '');
                return {
                    label: labelText,
                    ...((typeof label === 'object') ? label : {})
                };
            })
        }));

        const doc = {
            name: guideName,
            sourceUrl: url, // Store the source URL for cron jobs
            locale: locale || null,
            icon: icon || null,
            ordering: formattedOrdering,
            status: true,
            updatedAt: new Date()
        };
        
        // Use $setOnInsert for dateCreated to keep it persistent
        await guidesCol.updateOne(
            { name: guideName }, 
            { 
                $set: doc,
                $setOnInsert: { dateCreated: new Date() }
            }, 
            { upsert: true }
        );

        // 4. Process the guide immediately
        await processGuide(db, guideName);
    }

    return {
        guideName,
        questionsCount,
        url
    };
}

module.exports = {
    scrapeAndSaveGuide,
    normalize
};
