import React from "react";

interface ProgressBarProps {
  numerator: number;
  denominator: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  numerator,
  denominator,
}) => {
  return (
    <div>
      <div className="mb-1 flex justify-between">
        <span className="dark:text-gray text-base font-medium text-gray-700"></span>
        <span className="dark:text-gray text-sm font-medium text-gray-400">
          {numerator}/{denominator} XP
        </span>
      </div>
      <div className="dark:gray-700 h-10 w-full rounded-full bg-gray-200">
        <div
          className="h-10 rounded-full bg-gradient-to-r from-sciquelGreen to-sciquelTeal"
          style={{ width: `${(numerator / denominator) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
