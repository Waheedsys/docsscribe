const { ObjectId } = require('mongodb');
const crypto = require('crypto');

const SEARCH_INDEX = 'questionsIndex';
const SCORE_THRESHOLD = 0.06;
const QUESTIONS_COLL = 'questions';

async function searchTitle(col, query, limit = 5) {
    if (!query) return [];
    
    // Atlas Search aggregation pipeline
    const pipeline = [
        {
            $search: {
                index: SEARCH_INDEX,
                compound: {
                    should: [
                        { // exact-ish on title, high boost
                            text: { query, path: "title", score: { boost: { value: 6 } } }
                        },
                        { // fuzzy small edits
                            text: { query, path: "title", fuzzy: { maxEdits: 1, prefixLength: 1 }, score: { boost: { value: 3 } } }
                        },
                        { // tolerant fallback
                            text: { query, path: "title", fuzzy: { maxEdits: 2, prefixLength: 1 } }
                        }
                    ]
                },
                scoreDetails: false
            }
        },
        { $project: { title: 1, link: 1, score: { $meta: "searchScore" } } },
        { $sort: { score: -1 } },
        { $limit: limit }
    ];

    return col.aggregate(pipeline).toArray();
}

/**
 * Robust normalization for string matching.
 * Replaces non-alphanumeric with spaces, compresses whitespace, and converts to lowercase.
 */
function normalize(s) {
    return (s || '')
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * Finds a matching question in the questions collection.
 * Tries exact match on normalizedTitle first, then falls back to Atlas Search.
 */
async function findMatchingQuestion(col, label) {
    if (!label) return null;

    const normalizedLabel = normalize(label);

    // 1. Try exact match on normalizedTitle (fast and reliable)
    const exactMatch = await col.findOne({ normalizedTitle: normalizedLabel });
    if (exactMatch && exactMatch.link) {
        return exactMatch.link;
    }

    // 2. Fallback to Atlas Search
    try {
        const results = await searchTitle(col, label, 3);
        const bestCandidate = results.find(r => 
            r.link && 
            r.score >= SCORE_THRESHOLD
        );
        return bestCandidate ? bestCandidate.link : null;
    } catch (err) {
        console.error(`Atlas Search failed for "${label}":`, err.message);
        return null;
    }
}

/**
 * Processes a guide by mapping its ordering items to questions via Atlas Search.
 * @param {Db} db - The MongoDB database instance.
 * @param {string} guideName - The name of the guide to process.
 */
async function processGuide(db, guideName) {
    const questionsCol = db.collection(QUESTIONS_COLL);
    const guidesCol = db.collection('guides');
    const finalCol = db.collection('final_guides');

    // 1. Fetch the guide document
    const guideDoc = await guidesCol.findOne({ name: guideName });
    if (!guideDoc) {
        throw new Error(`Guide "${guideName}" not found in collection "guides".`);
    }

    console.log(`Processing guide: ${guideDoc.name}`);

    // 2. Prepare the output structure
    const finalDoc = {
        locale: guideDoc.locale || 'en',
        icon: guideDoc.icon || null,
        dateCreated: new Date(),
        status: true,
        questions: []
    };

    // Track assigned links to avoid duplicates
    const assignedLinks = new Set();

    // 3. Transform ordering -> questions
    if (Array.isArray(guideDoc.ordering)) {
        for (const section of guideDoc.ordering) {
            const cleanHeading = (section.heading || '').replace(/^\d+\.\s+/, '').trim();
            const subMenu = [];

            if (Array.isArray(section.children)) {
                for (const child of section.children) {
                    const label = child.label || '';
                    let matchedLink = null;

                    if (label) {
                        // Priority 1: Use existing link if provided
                        const existingLink = child.link;
                        if (existingLink) {
                            matchedLink = existingLink;
                            assignedLinks.add(matchedLink);
                        } 
                        // Priority 2: Robust matching (Exact match fallback -> Atlas Search)
                        else {
                            matchedLink = await findMatchingQuestion(questionsCol, label);
                            if (matchedLink) {
                                assignedLinks.add(matchedLink);
                            }
                        }
                    }

                    subMenu.push({
                        label: label,
                        content: {
                            type: 'HTML',
                            data: matchedLink // null if not found
                        },
                        status: true
                    });
                }
            }

            finalDoc.questions.push({
                menu: cleanHeading,
                subMenu: subMenu,
                status: true
            });
        }
    }

    // 4. Output and Save
    // Generate deterministic ObjectId using SHA-1 hash of the guideName
    // We take the first 12 bytes (24 hex characters) of the hash
    const hash = crypto.createHash('sha1').update(guideName).digest('hex').substring(0, 24);
    const _id = new ObjectId(hash);
    
    // We update if it exists for this _id, or insert new
    await finalCol.updateOne(
        { _id: _id }, 
        { 
            $set: finalDoc,
            $unset: { guideName: "" } // Explicitly remove guideName if it exists
        }, 
        { upsert: true }
    );
    
    console.log(`Successfully processed and saved guide "${guideName}" to final_guides.`);
    return finalDoc;
}

module.exports = { processGuide };
