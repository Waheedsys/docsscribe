const puppeteer = require('puppeteer');

async function scrapeScribeHow(url) {
    if (!url.includes('scribehow.com')) {
        throw new Error('Invalid URL. Must be a scribehow.com URL.');
    }

    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        
        console.log(`Navigating to: ${url}`);
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

        const data = await page.evaluate(async () => {
            try {
                // Method 1: JSON __NEXT_DATA__
                const nextData = document.getElementById('__NEXT_DATA__');
                if (nextData) {
                    const parsed = JSON.parse(nextData.textContent);
                    const pageProps = parsed.props?.pageProps;
                    if (pageProps) {
                        const dataObj = pageProps.document || pageProps.result || pageProps.scribe || pageProps.page;
                        if (dataObj) {
                            const guideName = dataObj.name || dataObj.title || document.title.replace(' | Scribe', '').trim();
                            const content = dataObj.editor_js_data?.content || dataObj.data?.content || dataObj.content || [];
                            
                            if (Array.isArray(content) && content.length > 0) {
                                let _scrapedItems = [];
                                let _scrapedQuestions = [];

                                for (const item of content) {
                                    const type = (item.type || '').toLowerCase();
                                    const attrs = item.attrs || {};
                                    const iData = item.data || {};

                                    if (type.includes('heading')) {
                                        // Heading text can be in item.content[0].text (nested) or item.text (direct)
                                        let text = '';
                                        if (item.content && Array.isArray(item.content) && item.content.length > 0) {
                                            text = item.content[0].text || '';
                                        } else {
                                            text = item.text || iData.text || attrs.text || '';
                                        }
                                        text = text.trim();
                                        if (text) _scrapedItems.push({ type: 'heading', text });
                                    } else {
                                        const localeUrl = attrs.scribeUrl || iData.scribeUrl || attrs.documentUrl || iData.documentUrl || attrs.url || iData.url;
                                        let title = attrs.name || iData.name || attrs.text || iData.text || attrs.title || iData.title || '';
                                        if (!title && attrs.scribe?.name) title = attrs.scribe.name;

                                        if (title && localeUrl) {
                                            const fullUrl = localeUrl.startsWith('http') ? localeUrl : `https://scribehow.com${localeUrl.startsWith('/') ? '' : '/'}${localeUrl}`;
                                            _scrapedQuestions.push({ title, link: fullUrl });
                                            _scrapedItems.push({ type: 'link', text: title, link: fullUrl });
                                        }
                                    }
                                }
                                if (_scrapedItems.length > 0) {
                                    return JSON.stringify({ guideName, questions: _scrapedQuestions, flatItems: _scrapedItems });
                                }
                            }
                        }
                    }
                }

                // Method 2: DOM-based Fallback
                console.log('Falling back to DOM-based scraping');
                const guideName = document.querySelector('h1')?.innerText || document.title.replace(' | Scribe', '').trim();
                let _scrapedItems = [];
                let _scrapedQuestions = [];

                // Find all headings and links in the main content area
                const elements = document.querySelectorAll('h1, h2, h3, a[href*="/viewer/"], a[href*="/page/"]');
                elements.forEach(el => {
                    const tag = el.tagName.toLowerCase();
                    if (tag.startsWith('h')) {
                        _scrapedItems.push({ type: 'heading', text: el.innerText.trim() });
                    } else if (tag === 'a') {
                        const title = el.innerText.trim();
                        const link = el.href;
                        if (title && link) {
                            _scrapedQuestions.push({ title, link });
                            _scrapedItems.push({ type: 'link', text: title, link });
                        }
                    }
                });

                return JSON.stringify({ guideName, questions: _scrapedQuestions, flatItems: _scrapedItems });
            } catch (e) {
                return JSON.stringify({ error: e.message });
            }
        });

        return JSON.parse(data);
    } catch (err) {
        console.error('Scraping failed:', err.message);
        throw err;
    } finally {
        await browser.close();
    }
}

module.exports = { scrapeScribeHow };
