import React from 'react';

interface ProgressBarProps {
  numerator: number;
  denominator: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ numerator, denominator }) => {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-base font-medium text-gray-700 dark:text-gray"></span>
        <span className="text-sm font-medium text-gray-400 dark:text-gray">{numerator}/{denominator} XP</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-10 dark:gray-700">
        <div className="bg-gradient-to-r from-sciquelGreen to-sciquelTeal h-10 rounded-full" style={{ width: `${(numerator / denominator) * 100}%` }}></div>
      </div>
    </div>

  );
};

export default ProgressBar;
