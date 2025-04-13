// src/hooks/use-toast.js
import { useState } from 'react';

const useToast = () => {
  const [toast, setToast] = useState(null);

  const showToast = (options) => {
    setToast(options);
    // Optionally, hide the toast after a certain duration
    setTimeout(() => setToast(null), options.duration || 3000);
  };

  return { toast: showToast };
};

export default useToast;