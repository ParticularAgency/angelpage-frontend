import React from 'react';

interface ProgressBarProps {
  progress: number;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, className }) => {
  return (
    <div className={`bg-mono-40 w-full rounded-full ${className}`}>
      <div
        style={{ width: `${progress}%` }}
        className="h-full bg-[#0B0112] rounded-full"
      ></div>
    </div>
  );
};

export default ProgressBar;
