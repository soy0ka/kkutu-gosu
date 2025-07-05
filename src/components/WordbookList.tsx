"use client";

import React from "react";
import WordbookCard from "./WordbookCard";

interface Wordbook {
  sid: string;
  title: string;
  samples: string[];
  wordCount: number;
  subscriptionCount: number;
}

interface WordbookListProps {
  wordbooks: Wordbook[];
  selectedWordbookId?: string | null;
  onWordbookSelect?: (id: string | null) => void;
}

const WordbookList: React.FC<WordbookListProps> = ({ 
  wordbooks, 
  selectedWordbookId, 
  onWordbookSelect 
}) => {
  const handleWordbookSelect = (id: string) => {
    const newSelectedId = selectedWordbookId === id ? null : id;
    onWordbookSelect?.(newSelectedId);
  };

  return (
    <div className="mt-6 grid grid-cols-2 gap-4 bg-[#fff] p-4 rounded-lg shadow-sm h-72 overflow-y-scroll">
      {wordbooks.map((wordbook) => (
        <WordbookCard
          key={wordbook.sid}
          id={wordbook.sid}
          title={wordbook.title}
          words={wordbook.samples}
          wordCount={wordbook.wordCount}
          userCount={wordbook.subscriptionCount}
          isSelected={selectedWordbookId === wordbook.sid}
          onSelect={handleWordbookSelect}
        />
      ))}
    </div>
  );
};

export default WordbookList;
