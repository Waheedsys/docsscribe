import React, { useState } from 'react';
import axios from 'axios';
import {
    Upload,
    Loader2,
    FileJson,
    BookOpen,
    Globe,
    LayoutList,
    Info,
    Sparkles
} from 'lucide-react';

const MuiButton = ({ children, variant = 'contained', color = 'primary', fullWidth, disabled, onClick, startIcon, sx, ...props }) => {
    const baseStyles = {
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 500,
        fontSize: '0.875rem',
        lineHeight: 1.75,
        letterSpacing: '0.02857em',
        textTransform: 'uppercase',
        minWidth: '64px',
        padding: '6px 16px',
        borderRadius: '4px',
        transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms cubic-bezier(0.4, 0, 0.2, 1)',
        border: 'none',
        cursor: disabled ? 'default' : 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        width: fullWidth ? '100%' : 'auto',
        opacity: disabled ? 0.38 : 1,
        pointerEvents: disabled ? 'none' : 'auto',
    };

    const variantStyles = {
        contained: {
            backgroundColor: color === 'primary' ? '#1976d2' : '#9c27b0',
            color: '#fff',
            boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
        },
        outlined: {
            backgroundColor: 'transparent',
            color: color === 'primary' ? '#1976d2' : '#9c27b0',
            border: `1px solid ${color === 'primary' ? 'rgba(25, 118, 210, 0.5)' : 'rgba(156, 39, 176, 0.5)'}`,
        },
        text: {
            backgroundColor: 'transparent',
            color: color === 'primary' ? '#1976d2' : '#9c27b0',
        }
    };

    const hoverStyles = !disabled ? {
        ':hover': {
            backgroundColor: variant === 'contained'
                ? (color === 'primary' ? '#1565c0' : '#7b1fa2')
                : variant === 'outlined'
                    ? (color === 'primary' ? 'rgba(25, 118, 210, 0.04)' : 'rgba(156, 39, 176, 0.04)')
                    : (color === 'primary' ? 'rgba(25, 118, 210, 0.04)' : 'rgba(156, 39, 176, 0.04)'),
            boxShadow: variant === 'contained' ? '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)' : undefined,
        }
    } : {};

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            style={{ ...baseStyles, ...variantStyles[variant], ...sx }}
            onMouseEnter={(e) => {
                if (!disabled && hoverStyles[':hover']) {
                    Object.assign(e.currentTarget.style, hoverStyles[':hover']);
                }
            }}
            onMouseLeave={(e) => {
                if (!disabled) {
                    Object.assign(e.currentTarget.style, variantStyles[variant]);
                }
            }}
            {...props}
        >
            {startIcon && <span style={{ display: 'flex', marginRight: '-4px' }}>{startIcon}</span>}
            {children}
        </button>
    );
};

const MuiTextField = ({ label, value, onChange, placeholder, multiline, rows, required, type = 'text', fullWidth, helperText, ...props }) => {
    const [focused, setFocused] = useState(false);

    return (
        <div style={{ width: fullWidth ? '100%' : 'auto', marginBottom: '4px' }}>
            <label style={{
                fontFamily: 'Roboto, sans-serif',
                fontSize: '12px',
                fontWeight: 400,
                lineHeight: 1.66,
                letterSpacing: '0.03333em',
                color: focused ? '#1976d2' : 'rgba(0, 0, 0, 0.6)',
                display: 'block',
                marginBottom: '4px',
                transition: 'color 200ms cubic-bezier(0.0, 0, 0.2, 1)',
            }}>
                {label} {required && <span style={{ color: '#d32f2f' }}>*</span>}
            </label>
            {multiline ? (
                <textarea
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    rows={rows || 4}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    style={{
                        fontFamily: multiline ? "'Roboto Mono', monospace" : 'Roboto, sans-serif',
                        fontSize: '16px',
                        lineHeight: 1.5,
                        padding: '16.5px 14px',
                        width: '100%',
                        borderRadius: '4px',
                        border: `1px solid ${focused ? '#1976d2' : 'rgba(0, 0, 0, 0.23)'}`,
                        outline: 'none',
                        transition: 'border-color 200ms cubic-bezier(0.0, 0, 0.2, 1)',
                        backgroundColor: '#fff',
                        color: 'rgba(0, 0, 0, 0.87)',
                        resize: 'vertical',
                        boxSizing: 'border-box',
                    }}
                    {...props}
                />
            ) : (
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    style={{
                        fontFamily: 'Roboto, sans-serif',
                        fontSize: '16px',
                        lineHeight: 1.5,
                        padding: '16.5px 14px',
                        width: '100%',
                        borderRadius: '4px',
                        border: `1px solid ${focused ? '#1976d2' : 'rgba(0, 0, 0, 0.23)'}`,
                        outline: 'none',
                        transition: 'border-color 200ms cubic-bezier(0.0, 0, 0.2, 1)',
                        backgroundColor: '#fff',
                        color: 'rgba(0, 0, 0, 0.87)',
                        boxSizing: 'border-box',
                    }}
                    {...props}
                />
            )}
            {helperText && (
                <p style={{
                    fontFamily: 'Roboto, sans-serif',
                    fontSize: '12px',
                    lineHeight: 1.66,
                    letterSpacing: '0.03333em',
                    color: 'rgba(0, 0, 0, 0.6)',
                    margin: '3px 14px 0',
                }}>
                    {helperText}
                </p>
            )}
        </div>
    );
};

const MuiCard = ({ children, elevation = 3 }) => {
    const shadows = {
        1: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
        3: '0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)',
        8: '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)',
    };

    return (
        <div style={{
            backgroundColor: '#fff',
            borderRadius: '4px',
            boxShadow: shadows[elevation] || shadows[3],
            overflow: 'hidden',
        }}>
            {children}
        </div>
    );
};

const MuiAlert = ({ severity = 'info', children, icon }) => {
    const colors = {
        info: { bg: 'rgb(229, 246, 253)', text: 'rgb(1, 67, 97)', icon: 'rgb(3, 169, 244)' },
        success: { bg: 'rgb(237, 247, 237)', text: 'rgb(30, 70, 32)', icon: 'rgb(46, 125, 50)' },
        warning: { bg: 'rgb(255, 244, 229)', text: 'rgb(102, 60, 0)', icon: 'rgb(237, 108, 2)' },
        error: { bg: 'rgb(253, 237, 237)', text: 'rgb(95, 33, 32)', icon: 'rgb(211, 47, 47)' },
    };

    return (
        <div style={{
            fontFamily: 'Roboto, sans-serif',
            backgroundColor: colors[severity].bg,
            color: colors[severity].text,
            padding: '6px 16px',
            fontSize: '0.875rem',
            lineHeight: 1.43,
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
        }}>
            {icon && <div style={{ color: colors[severity].icon, display: 'flex', fontSize: '22px', opacity: 0.9 }}>{icon}</div>}
            <div>{children}</div>
        </div>
    );
};

const MuiSnackbar = ({ open, message, severity = 'success', onClose }) => {
    React.useEffect(() => {
        if (open) {
            const timer = setTimeout(onClose, 4000);
            return () => clearTimeout(timer);
        }
    }, [open, onClose]);

    if (!open) return null;

    const colors = {
        success: '#2e7d32',
        error: '#d32f2f',
        warning: '#ed6c02',
        info: '#0288d1',
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '24px',
            left: '24px',
            zIndex: 1400,
            animation: 'slideIn 225ms cubic-bezier(0, 0, 0.2, 1)',
        }}>
            <style>{`
                @keyframes slideIn {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
            `}</style>
            <div style={{
                fontFamily: 'Roboto, sans-serif',
                backgroundColor: colors[severity],
                color: '#fff',
                padding: '6px 16px',
                fontSize: '0.875rem',
                lineHeight: 1.43,
                borderRadius: '4px',
                boxShadow: '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)',
                display: 'flex',
                alignItems: 'center',
                minWidth: '300px',
            }}>
                {message}
            </div>
        </div>
    );
};

const MuiToggleButton = ({ value, selected, onChange, children, ...props }) => {
    const [hover, setHover] = useState(false);

    return (
        <button
            onClick={() => onChange(value)}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 500,
                fontSize: '0.8125rem',
                lineHeight: 1.75,
                letterSpacing: '0.02857em',
                textTransform: 'uppercase',
                padding: '7px 15px',
                border: '1px solid rgba(0, 0, 0, 0.12)',
                borderRadius: '4px',
                backgroundColor: selected ? 'rgba(25, 118, 210, 0.08)' : (hover ? 'rgba(0, 0, 0, 0.04)' : 'transparent'),
                color: selected ? '#1976d2' : 'rgba(0, 0, 0, 0.87)',
                cursor: 'pointer',
                transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), color 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
            }}
            {...props}
        >
            {children}
        </button>
    );
};

const CombinedInputForm = () => {
    const [mode, setMode] = useState('auto');
    const [guideName, setGuideName] = useState('');
    const [scrapeUrl, setScrapeUrl] = useState('');
    const [locale, setLocale] = useState('');
    const [icon, setIcon] = useState('');
    const [questionsJson, setQuestionsJson] = useState('');
    const [orderingJson, setOrderingJson] = useState('');
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ isOpen: false, message: '', type: 'success' });

    const handleSubmit = async () => {
        setLoading(true);
        setSnackbar({ isOpen: false, message: '', type: 'success' });

        // Validation Logic
        if (mode === 'auto') {
            // 1. Validate URL
            if (!scrapeUrl || !scrapeUrl.includes('scribehow.com/')) {
                setSnackbar({
                    isOpen: true,
                    type: 'error',
                    message: 'Invalid URL. Please enter a valid ScribeHow link (e.g., https://scribehow.com/...).'
                });
                setLoading(false);
                return;
            }

            // 2. Validate Icon and Locale (Mandatory)
            if (!icon || !icon.trim()) {
                setSnackbar({
                    isOpen: true,
                    type: 'error',
                    message: 'Icon field is mandatory.'
                });
                setLoading(false);
                return;
            }

            if (!locale || !locale.trim()) {
                setSnackbar({
                    isOpen: true,
                    type: 'error',
                    message: 'Locale field is mandatory (e.g., en-US, fr-FR).'
                });
                setLoading(false);
                return;
            }

            try {
                // 3. Real API Call
                const response = await axios.post('http://localhost:3000/api/scrape-and-process', {
                    url: scrapeUrl,
                    locale: locale,
                    icon: icon
                });

                setSnackbar({
                    isOpen: true,
                    type: 'success',
                    message: response.data.message || 'Successfully scraped and processed guide!'
                });

                // Clear form fields after success
                setScrapeUrl('');
                setLocale('');
                setIcon('');
            } catch (err) {
                console.error('API Error:', err);
                setSnackbar({
                    isOpen: true,
                    type: 'error',
                    message: err.response?.data?.details || err.message || 'Failed to process request.'
                });
            } finally {
                setLoading(false);
            }

        } else {
            // Manual Mode Logic (Existing placeholder or future implementation)
            // Ideally should also validate guideName here
            if (!guideName.trim()) {
                setSnackbar({
                    isOpen: true,
                    type: 'error',
                    message: 'Guide Name is required.'
                });
                setLoading(false);
                return;
            }

            setTimeout(() => {
                setSnackbar({
                    isOpen: true,
                    type: 'success',
                    message: 'Manual data uploaded successfully!'
                });
                setLoading(false);
            }, 2000);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f5f5f5',
            padding: '24px',
            fontFamily: 'Roboto, sans-serif',
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <MuiCard elevation={3}>
                    {/* Header */}
                    <div style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        padding: '32px',
                        color: '#fff',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '24px' }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '8px',
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                            }}>
                                <BookOpen size={32} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                    <h1 style={{
                                        fontSize: '2rem',
                                        fontWeight: 500,
                                        margin: 0,
                                        letterSpacing: '-0.5px',
                                    }}>
                                        Import Guide Data
                                    </h1>
                                    <Sparkles size={24} style={{ opacity: 0.9 }} />
                                </div>
                                <p style={{
                                    fontSize: '1rem',
                                    margin: 0,
                                    opacity: 0.95,
                                    fontWeight: 400,
                                }}>
                                    Configure and import your guide settings with ease
                                </p>
                            </div>
                        </div>

                        {/* Mode Toggle */}
                        <div style={{
                            display: 'inline-flex',
                            gap: '8px',
                            backgroundColor: 'rgba(0, 0, 0, 0.1)',
                            padding: '4px',
                            borderRadius: '4px',
                        }}>
                            <MuiToggleButton
                                value="auto"
                                selected={mode === 'auto'}
                                onChange={setMode}
                            >
                                <Globe size={18} />
                                Auto-Fetch
                            </MuiToggleButton>
                            <MuiToggleButton
                                value="manual"
                                selected={mode === 'manual'}
                                onChange={setMode}
                            >
                                <LayoutList size={18} />
                                Manual JSON
                            </MuiToggleButton>
                        </div>
                    </div>

                    {/* Form Content */}
                    <div style={{ padding: '32px' }}>
                        {/* Info Alert */}
                        <div style={{ marginBottom: '32px' }}>
                            <MuiAlert severity="info" icon={<Info size={22} />}>
                                {mode === 'auto'
                                    ? "Simply paste the ScribeHow page URL and we'll automatically extract all guide information for you. It's that easy!"
                                    : "Paste the raw JSON data for Questions and Ordering below for manual processing and validation. We'll handle the rest."
                                }
                            </MuiAlert>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {/* Primary Input */}
                            {mode === 'auto' ? (
                                <MuiTextField
                                    label="ScribeHow URL"
                                    type="url"
                                    value={scrapeUrl}
                                    onChange={(e) => setScrapeUrl(e.target.value)}
                                    placeholder="https://scribehow.com/page/..."
                                    required
                                    fullWidth
                                />
                            ) : (
                                <MuiTextField
                                    label="Guide Name"
                                    value={guideName}
                                    onChange={(e) => setGuideName(e.target.value)}
                                    placeholder="e.g. Smart Audit - TOC"
                                    required
                                    fullWidth
                                />
                            )}

                            {/* Optional Fields -> Now Mandatory */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
                                <MuiTextField
                                    label="Locale"
                                    value={locale}
                                    onChange={(e) => setLocale(e.target.value)}
                                    placeholder="e.g. en-US"
                                    fullWidth
                                    required
                                />
                                <MuiTextField
                                    label="Icon"
                                    value={icon}
                                    onChange={(e) => setIcon(e.target.value)}
                                    placeholder="e.g. settings"
                                    fullWidth
                                    required
                                />
                            </div>

                            {/* JSON Inputs for Manual Mode */}
                            {mode === 'manual' && (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
                                    <MuiTextField
                                        label={
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <FileJson size={16} />
                                                Questions Data (JSON)
                                            </span>
                                        }
                                        multiline
                                        rows={20}
                                        value={questionsJson}
                                        onChange={(e) => setQuestionsJson(e.target.value)}
                                        placeholder='[ { "title": "...", "link": "..." }, ... ]'
                                        fullWidth
                                    />
                                    <MuiTextField
                                        label={
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <FileJson size={16} />
                                                Ordering Data (JSON)
                                            </span>
                                        }
                                        multiline
                                        rows={20}
                                        value={orderingJson}
                                        onChange={(e) => setOrderingJson(e.target.value)}
                                        placeholder='[ { "heading": "...", "children": [] }, ... ]'
                                        fullWidth
                                    />
                                </div>
                            )}

                            {/* Submit Button */}
                            <div style={{
                                paddingTop: '24px',
                                borderTop: '1px solid rgba(0, 0, 0, 0.12)',
                                display: 'flex',
                                justifyContent: 'flex-end',
                            }}>
                                <MuiButton
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSubmit}
                                    disabled={loading || (mode === 'auto' ? !scrapeUrl.trim() : !guideName.trim())}
                                    startIcon={loading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
                                    sx={{
                                        padding: '12px 32px',
                                        fontSize: '0.9375rem',
                                        minWidth: '240px',
                                    }}
                                >
                                    {loading ? 'Processing...' : (mode === 'auto' ? 'Scrape & Import' : 'Upload Manual Data')}
                                </MuiButton>
                            </div>
                        </div>
                    </div>
                </MuiCard>
            </div>

            <MuiSnackbar
                open={snackbar.isOpen}
                message={snackbar.message}
                severity={snackbar.type}
                onClose={() => setSnackbar({ ...snackbar, isOpen: false })}
            />

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default CombinedInputForm;