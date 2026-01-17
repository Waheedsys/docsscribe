import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

const Snackbar = ({ message, type = 'error', isOpen, onClose, duration = 5000 }) => {
    useEffect(() => {
        if (isOpen && duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [isOpen, duration, onClose]);

    if (!isOpen) return null;

    const bgColor = type === 'success'
        ? 'bg-gradient-to-r from-green-500/90 to-emerald-500/90'
        : 'bg-gradient-to-r from-red-500/90 to-rose-500/90';

    const Icon = type === 'success' ? CheckCircle : AlertCircle;

    return (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-slide-up">
            <div className={`${bgColor} backdrop-blur-lg text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[320px] max-w-[500px] border border-white/20`}>
                <Icon size={22} className="flex-shrink-0" />
                <p className="flex-1 text-sm font-medium leading-relaxed">{message}</p>
                <button
                    onClick={onClose}
                    className="flex-shrink-0 hover:bg-white/20 rounded-full p-1 transition-colors"
                    aria-label="Close"
                >
                    <X size={18} />
                </button>
            </div>
        </div>
    );
};

export default Snackbar;
