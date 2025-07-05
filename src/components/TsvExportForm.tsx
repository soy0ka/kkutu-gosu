"use client";

import { Check } from "lucide-react";
import Image from "next/image";
import React from "react";
import Hacking from "~/assets/images/hacking.webp";
import WordbookCard from "./WordbookCard";
import WordbookList from "./WordbookList";

interface TsvExportFormProps {
  wordbooks: {
    sid: string;
    title: string;
    samples: string[];
    wordCount: number;
    subscriptionCount: number;
  }[];
  selectedWordbookId: string | null;
  selectedWordbook?: {
    sid: string;
    title: string;
    samples: string[];
    wordCount: number;
    subscriptionCount: number;
  } | null;
  onWordbookSelect: (id: string | null) => void;
}

const TsvExportForm: React.FC<TsvExportFormProps> = ({ 
  wordbooks, 
  selectedWordbookId, 
  selectedWordbook, 
  onWordbookSelect 
}) => {
  const handleExport = async () => {
    if (!selectedWordbookId) {
      alert("낱말집을 선택해주세요.");
      return;
    }

    try {
      console.log("Exporting wordbook:", selectedWordbookId);
    } catch (error) {
      console.error("Export failed:", error);
      alert("내보내기에 실패했습니다.");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center space-x-2">
          <span>낱말집</span>
          <Image
            src={Hacking}
            alt="moremi_sign hacking"
            className="w-10 h-10 mb-1"
          />
          <span>해서 TSV로 내보내기</span>
        </h2>
      </div>

      <WordbookList 
        wordbooks={wordbooks} 
        selectedWordbookId={selectedWordbookId}
        onWordbookSelect={onWordbookSelect}
      />

      <div className="mb-6">
        <div className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2 mt-3">
          <div className="flex items-center justify-center w-5 h-5">
            <Check className="w-3 h-3" />
          </div>
          <span>선택된 낱말집</span>
        </div>
        
        {selectedWordbook ? (
          <WordbookCard
            id={selectedWordbook.sid}
            title={selectedWordbook.title}
            words={selectedWordbook.samples}
            wordCount={selectedWordbook.wordCount}
            userCount={selectedWordbook.subscriptionCount}
            isSelected={true}
            onSelect={() => {}}
          />
        ) : (
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center gap-4">
              <div className="w-16 h-20 bg-gray-300 rounded animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 rounded animate-pulse w-3/4"></div>
                <div className="h-3 bg-gray-300 rounded animate-pulse w-1/2"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-300 rounded-full animate-pulse w-16"></div>
                  <div className="h-6 bg-gray-300 rounded-full animate-pulse w-16"></div>
                  <div className="h-6 bg-gray-300 rounded-full animate-pulse w-16"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="text-center">
        <button
          onClick={handleExport}
          disabled={!selectedWordbookId}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            selectedWordbookId
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          TSV 파일로 내보내기
        </button>
      </div>
    </div>
  );
};

export default TsvExportForm;
