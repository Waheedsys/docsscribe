const cron = require('node-cron');
const { scrapeAndSaveGuide } = require('./guideService');

/**
 * Initializes cron jobs for periodic data updates.
 * @param {import('mongodb').Db} db 
 */
function initCronJobs(db) {
    // Schedule a job to run every day at Midnight (00:00)
    // Format: minute hour day-of-month month day-of-week
    cron.schedule('0 0 * * *', async () => {
        console.log('Running scheduled guide update cron job...');
        try {
            const guidesCol = db.collection('guides');
            // Find all guides that have a sourceUrl
            const guidesToUpdate = await guidesCol.find({ sourceUrl: { $exists: true, $ne: null } }).toArray();

            console.log(`Found ${guidesToUpdate.length} guides to update.`);

            for (const guide of guidesToUpdate) {
                console.log(`Updating guide: ${guide.name} from ${guide.sourceUrl}`);
                try {
                    await scrapeAndSaveGuide(db, guide.sourceUrl, guide.locale, guide.icon);
                    console.log(`Successfully updated guide: ${guide.name}`);
                } catch (err) {
                    console.error(`Failed to update guide ${guide.name}:`, err.message);
                }
            }
        } catch (err) {
            console.error('Error in guide update cron job:', err);
        }
    });

    console.log('Cron jobs initialized: Daily update at 00:00');
}

module.exports = {
    initCronJobs
};
