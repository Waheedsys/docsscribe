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

    const Icon = type === 'success' ? CheckCircle : AlertCircle;

    return (
        <>
            <style>{`
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                .snackbar-container {
                    animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }
            `}</style>
            
            <div className="snackbar-container fixed bottom-8 right-8 z-50">
                <div className={`
                    ${type === 'success' 
                        ? 'bg-gradient-to-br from-emerald-500/95 to-green-600/95 shadow-emerald-500/30' 
                        : 'bg-gradient-to-br from-red-500/95 to-rose-600/95 shadow-red-500/30'
                    }
                    backdrop-blur-xl text-white px-6 py-4 rounded-2xl shadow-2xl 
                    flex items-center gap-4 min-w-[380px] max-w-[480px] border border-white/20
                `}>
                    <div className="p-2 rounded-full bg-white/20">
                        <Icon size={20} className="flex-shrink-0" />
                    </div>
                    <p className="flex-1 text-sm font-medium leading-relaxed">{message}</p>
                    <button
                        onClick={onClose}
                        className="flex-shrink-0 hover:bg-white/20 rounded-lg p-2 transition-all duration-200"
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>
        </>
    );
};

export default Snackbar;