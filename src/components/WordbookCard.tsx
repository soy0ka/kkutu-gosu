"use client";

import React from "react";

interface WordbookCardProps {
  title: string;
  wordCount: number;
  userCount: number;
  words: string[];
  onSelect?: (id: string) => void;
  isSelected?: boolean;
  id: string;
}

const WordbookCard: React.FC<WordbookCardProps> = ({
  title,
  wordCount,
  userCount,
  words,
  onSelect,
  isSelected = false,
  id,
}) => {
  const handleClick = () => {
    onSelect?.(id);
  };

  return (
    <li 
      className={`text-gray-700 group relative flex cursor-pointer flex-row-reverse items-start transition-all duration-200 ${
        isSelected 
          ? 'bg-blue-50 border-2 border-blue-300 rounded-lg shadow-md' 
          : 'hover:bg-gray-50'
      }`}
      onClick={handleClick}
    >
    <div className="relative -left-1 top-2 flex max-h-24 flex-1 flex-col gap-0.5 overflow-hidden bg-gradient-to-r from-white to-transparent py-1.5 pl-4 pr-8">
      <div className="text-sm font-bold ">{title}</div>
      <div className="flex items-center gap-1 text-b4">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-type size-4">
          <polyline points="4 7 4 4 20 4 20 7"></polyline>
          <line x1="9" x2="15" y1="20" y2="20"></line>
          <line x1="12" x2="12" y1="4" y2="20"></line>
        </svg>
        {wordCount.toLocaleString()}개
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users size-4">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
        {userCount.toLocaleString()}명
      </div>
      <ul className="flex flex-wrap gap-1.5">
        {words.map((word, idx) => (
          <li key={idx} className="max-w-48 truncate rounded-full bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-300 px-1 py-0.5 text-xs font-medium text-gray-700 shadow-sm">
        {word}
          </li>
        ))}
      </ul>
    </div>
    <div
      className="inline-block relative transition-transform duration-300 group-hover:scale-105"
      style={{ perspective: "31.25rem" }}
    >
      <div
        className="relative m-auto drop-sha-black/20 drop-sha-blur-md"
        style={{ transform: "rotateX(5deg)" }}
      >
        <div
          className="absolute -right-0.5 left-0 top-6 translate-y-0.5 rounded-md bg-cover bg-origin-border"
          style={{
            top: "7.5px",
            height: "100px",
            filter: "brightness(30%)",
            backgroundImage: "linear-gradient(rgb(45, 45, 45), rgb(0, 0, 0))",
          }}
        ></div>
        <div
          className="absolute inset-x-0 rounded-bl-md"
          style={{
            top: "100px",
            height: "7.5px",
            clipPath: "path('M 6 0 Q 2 3.75 6 7.5 L 66 7.5 Q 62 3.75 66 0')",
            backgroundImage:
              "linear-gradient(rgb(255, 255, 255) 49%, rgb(243, 244, 245) 51%)",
            backgroundSize: "100% 2px",
          }}
        >
          <div className="absolute inset-x-0 h-4 bg-gradient-to-b from-black/20 to-transparent"></div>
        </div>
        <div
          className="rounded-md rounded-bl-0 border-r border-r-black/20 bg-cover bg-center bg-origin-border"
          style={{
            width: "72px",
            height: "108px",
            clipPath: "path('M 0 0 L 0 108 Q 0 100 8 100 L 64 100 Q 72 100 72 92 L 72 0')",
            backgroundImage: "linear-gradient(rgb(45, 45, 45), rgb(0, 0, 0))",
          }}
        >
          <div className="absolute inset-y-0 w-1.5 rounded-tl-md bg-gradient-to-r from-black/30 to-transparent"></div>
        </div>
        <label className="absolute truncate py-2 text-center font-extrabold text-white text-shadow-black inset-x-0.5 top-4 text-xs text-sha-blur-xs">
          {title}
        </label>
      </div>
    </div>
    {isSelected && (
      <div className="absolute top-2 right-2 z-10">
        <div className="bg-blue-500 text-white rounded-full p-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check">
            <path d="m9 12 2 2 4-4"></path>
          </svg>
        </div>
      </div>
    )}
  </li>
  );
};

export default WordbookCard;
