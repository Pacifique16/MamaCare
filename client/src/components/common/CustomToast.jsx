import React, { useEffect, useState } from 'react';
import { toast, resolveValue } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const ToastIcon = ({ type }) => {
  switch (type) {
    case 'success': return <CheckCircle className="text-green-500" size={24} />;
    case 'error': return <AlertCircle className="text-red-500" size={24} />;
    case 'loading': return <div className="w-6 h-6 border-2 border-gray-100 border-t-mamacare-teal rounded-full animate-spin" />;
    default: return <Info className="text-blue-500" size={24} />;
  }
};

const getBorderColor = (type) => {
  switch (type) {
    case 'success': return 'bg-green-500';
    case 'error': return 'bg-red-500';
    case 'loading': return 'bg-mamacare-teal';
    default: return 'bg-blue-500';
  }
};

const CustomToast = ({ t }) => {
  const [progress, setProgress] = useState(100);
  const duration = t.duration || 4000;

  useEffect(() => {
    if (t.visible) {
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
        setProgress(remaining);
        if (remaining <= 0) clearInterval(interval);
      }, 10);
      return () => clearInterval(interval);
    }
  }, [t.visible, duration]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`
        relative min-w-[400px] max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 
        overflow-hidden flex items-center gap-4 p-6 font-poppins
        ${t.visible ? 'animate-in' : 'animate-out'}
      `}
    >
      <div className="shrink-0">
        <ToastIcon type={t.type} />
      </div>
      
      <div className="flex-1 space-y-1">
        <p className="text-[15px] font-bold text-gray-900 leading-tight">
          {resolveValue(t.message, t)}
        </p>
      </div>

      <button 
        onClick={() => toast.dismiss(t.id)}
        className="shrink-0 p-1.5 hover:bg-gray-50 rounded-lg text-gray-400 transition-colors"
      >
        <X size={18} />
      </button>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-50">
        <motion.div 
          initial={{ width: '100%' }}
          animate={{ width: `${progress}%` }}
          className={`h-full ${getBorderColor(t.type)} transition-none`}
        />
      </div>
    </motion.div>
  );
};

export default CustomToast;
