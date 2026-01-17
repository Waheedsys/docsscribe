import React, { useState } from 'react';
import axios from 'axios';
import { Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const InputForm = ({ title, endpoint, placeholder, exampleFormat }) => {
    const [inputData, setInputData] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: string }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            let parsedData;
            try {
                parsedData = JSON.parse(inputData);
            } catch (err) {
                throw new Error("Invalid JSON format. Please check your input.");
            }

            const response = await axios.post(`http://localhost:3000${endpoint}`, parsedData);

            setStatus({
                type: 'success',
                message: response.data.message || 'Data uploaded successfully!'
            });
            console.log('Success:', response.data);
        } catch (err) {
            console.error('Submission error:', err);
            setStatus({
                type: 'error',
                message: err.response?.data?.error || err.message || 'Failed to upload data.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card mb-8">
            <div className="flex items-center gap-3 mb-4">
                <h2 className="text-2xl font-bold">{title}</h2>
            </div>

            <p className="text-secondary mb-4 text-sm opacity-80">
                Paste your JSON data below. {exampleFormat && <span className="italic">Expected format: {exampleFormat}</span>}
            </p>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <textarea
                        className="w-full h-64 font-mono text-sm leading-relaxed"
                        placeholder={placeholder}
                        value={inputData}
                        onChange={(e) => setInputData(e.target.value)}
                        spellCheck="false"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="btn btn-primary gap-2"
                        disabled={loading || !inputData.trim()}
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
                        {loading ? 'Processing...' : 'Upload Data'}
                    </button>

                    {status && (
                        <div className={`flex items-center gap-2 text-sm font-medium ${status.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                            {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                            {status.message}
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};

export default InputForm;
