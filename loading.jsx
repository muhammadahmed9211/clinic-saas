import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading = ({ size = 'md', fullScreen = false, text = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };
  
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
        <div className="text-center">
          <Loader2 className={`${sizes[size]} animate-spin text-primary-600 mx-auto`} />
          {text && <p className="mt-4 text-gray-600">{text}</p>}
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <Loader2 className={`${sizes[size]} animate-spin text-primary-600 mx-auto`} />
        {text && <p className="mt-2 text-sm text-gray-600">{text}</p>}
      </div>
    </div>
  );
};

export default Loading;