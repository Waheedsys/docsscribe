import React, { useState } from 'react';
import axios from 'axios';
import { Upload, CheckCircle, AlertCircle, Loader2, FileJson, BookOpen, Globe, LayoutList } from 'lucide-react';
import Snackbar from './Snackbar';

const CombinedInputForm = () => {
    const [mode, setMode] = useState('auto'); // 'manual' | 'auto'
    const [guideName, setGuideName] = useState('');
    const [scrapeUrl, setScrapeUrl] = useState('');
    const [locale, setLocale] = useState('');
    const [icon, setIcon] = useState('');
    const [questionsJson, setQuestionsJson] = useState('');
    const [orderingJson, setOrderingJson] = useState('');

    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ isOpen: false, message: '', type: 'error' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSnackbar({ isOpen: false, message: '', type: 'error' });

        try {
            if (mode === 'auto') {
                if (!scrapeUrl.trim()) {
                    throw new Error("ScribeHow URL is required.");
                }

                const payload = {
                    url: scrapeUrl.trim(),
                    locale: locale.trim() || null,
                    icon: icon.trim() || null
                };

                const response = await axios.post('http://localhost:3000/api/scrape-and-process', payload);

                setSnackbar({
                    isOpen: true,
                    type: 'success',
                    message: `Successfully scraped and processed: ${response.data.guideName}`
                });
                console.log('Success:', response.data);

            } else {
                if (!guideName.trim()) {
                    throw new Error("Guide Name is required.");
                }

                let parsedQuestions = [];
                let parsedOrdering = [];

                if (questionsJson.trim()) {
                    try {
                        parsedQuestions = JSON.parse(questionsJson);
                        if (!Array.isArray(parsedQuestions)) throw new Error();
                    } catch (err) {
                        throw new Error("Invalid format for Questions Data. Must be a JSON Array.");
                    }
                }

                if (orderingJson.trim()) {
                    try {
                        parsedOrdering = JSON.parse(orderingJson);
                        if (!Array.isArray(parsedOrdering)) throw new Error();
                    } catch (err) {
                        throw new Error("Invalid format for Guide Ordering Data. Must be a JSON Array.");
                    }
                }

                if (parsedQuestions.length === 0 && parsedOrdering.length === 0) {
                    throw new Error("Please provide either Questions data or Guide Ordering data.");
                }

                const payload = {
                    guideName: guideName.trim(),
                    locale: locale.trim() || null,
                    icon: icon.trim() || null,
                    questions: parsedQuestions,
                    ordering: parsedOrdering
                };

                const response = await axios.post('http://localhost:3000/api/full-guide-data', payload);

                setSnackbar({
                    isOpen: true,
                    type: 'success',
                    message: response.data.message || 'Data processed successfully!'
                });
                console.log('Success:', response.data);
            }

        } catch (err) {
            console.error('Submission error:', err);
            // Extract detailed error message
            let errorMessage = 'Failed to process data.';
            // setSnackbar({
            //     isOpen: true,
            //     type: 'error',
            //     message: err.response?.data?.error || err.message || 'Failed to process data.'
            // });
            if (err.response?.data) {
                // Check for various error formats
                if (err.response.data.details) {
                    errorMessage = err.response.data.details;
                }
            } else {
                errorMessage = err.message;
            }

            setSnackbar({
                isOpen: true,
                type: 'error',
                message: errorMessage
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card w-full max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <BookOpen className="text-accent-primary" size={28} />
                    <h2 className="text-2xl font-bold">Import Guide Data</h2>
                </div>

                <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
                    <button
                        type="button"
                        onClick={() => setMode('auto')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${mode === 'auto' ? 'bg-accent-primary text-white shadow-lg shadow-accent-primary/20' : 'text-text-secondary hover:text-white'}`}
                    >
                        <Globe size={16} /> Auto-Fetch
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('manual')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${mode === 'manual' ? 'bg-accent-primary text-white shadow-lg shadow-accent-primary/20' : 'text-text-secondary hover:text-white'}`}
                    >
                        <LayoutList size={16} /> Manual JSON
                    </button>
                </div>
            </div>

            <p className="text-text-secondary mb-8 text-sm opacity-80">
                {mode === 'auto'
                    ? "Simply paste the ScribeHow page URL and we'll automatically extract everything for you."
                    : "Paste the raw JSON data for Questions and Ordering below for manual processing."
                }
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">

                {mode === 'auto' ? (
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary ml-1">ScribeHow URL <span className="text-accent-error">*</span></label>
                        <input
                            type="url"
                            className="w-full font-medium text-lg"
                            placeholder="https://scribehow.com/page/..."
                            value={scrapeUrl}
                            onChange={(e) => setScrapeUrl(e.target.value)}
                            required
                        />
                    </div>
                ) : (
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary ml-1">Guide Name <span className="text-accent-error">*</span></label>
                        <input
                            type="text"
                            className="w-full font-medium text-lg"
                            placeholder="e.g. Smart Audit - TOC"
                            value={guideName}
                            onChange={(e) => setGuideName(e.target.value)}
                            required
                        />
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Locale Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary ml-1">Locale</label>
                        <input
                            type="text"
                            className="w-full font-medium text-lg"
                            placeholder="e.g. en-US"
                            value={locale}
                            onChange={(e) => setLocale(e.target.value)}
                        />
                    </div>

                    {/* Icon Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary ml-1">Icon</label>
                        <input
                            type="text"
                            className="w-full font-medium text-lg"
                            placeholder="e.g. settings"
                            value={icon}
                            onChange={(e) => setIcon(e.target.value)}
                        />
                    </div>
                </div>

                {mode === 'manual' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Questions Input */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 mb-1">
                                <FileJson size={16} className="text-accent-secondary" />
                                <label className="text-sm font-medium text-text-secondary">Questions Data (JSON)</label>
                            </div>
                            <textarea
                                className="w-full h-80 font-mono text-xs leading-relaxed opacity-90 focus:opacity-100 transition-opacity"
                                placeholder='[ { "title": "...", "link": "..." }, ... ]'
                                value={questionsJson}
                                onChange={(e) => setQuestionsJson(e.target.value)}
                                spellCheck="false"
                            />
                        </div>

                        {/* Ordering Input */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 mb-1">
                                <FileJson size={16} className="text-accent-secondary" />
                                <label className="text-sm font-medium text-text-secondary">Ordering Data (JSON)</label>
                            </div>
                            <textarea
                                className="w-full h-80 font-mono text-xs leading-relaxed opacity-90 focus:opacity-100 transition-opacity"
                                placeholder='[ { "heading": "...", "children": [] }, ... ]'
                                value={orderingJson}
                                onChange={(e) => setOrderingJson(e.target.value)}
                                spellCheck="false"
                            />
                        </div>
                    </div>
                )}

                <div className="pt-4 flex items-center justify-end border-t border-white/5 mt-4">
                    <button
                        type="submit"
                        className="btn btn-primary gap-2 min-w-[200px]"
                        disabled={loading || (mode === 'auto' ? !scrapeUrl.trim() : !guideName.trim())}
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
                        {loading ? 'Processing...' : (mode === 'auto' ? 'Scrape & Import' : 'Upload Manual Data')}
                    </button>
                </div>
            </form>

            <Snackbar
                message={snackbar.message}
                type={snackbar.type}
                isOpen={snackbar.isOpen}
                onClose={() => setSnackbar({ ...snackbar, isOpen: false })}
            />
        </div>
    );
};

export default CombinedInputForm;
