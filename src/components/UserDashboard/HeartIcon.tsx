import React, { type FC } from "react";

interface HeartIconProps {
  size: string;
  color: string;
}

const HeartIcon: FC<HeartIconProps> = ({ size, color }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`h-${size} w-${size} text-${color}`}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M10 18l-1.45-1.32C3.77 12.08 1 9.11 1 5.5 1 3.43 2.42 2 4.5 2 5.74 2 7.21 2.89 10 5.14 12.79 2.89 14.26 2 15.5 2 17.58 2 19 3.43 19 5.5c0 3.61-2.77 6.58-8.55 11.18L10 18z"
        clipRule="evenodd"
      />
    </svg>
  );
};

export default HeartIcon;
