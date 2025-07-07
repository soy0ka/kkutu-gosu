"use client";

import { Check, Download, Loader2 } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import Hacking from "~/assets/images/hacking.webp";
import WordbookCard from "./WordbookCard";
import WordbookList from "./WordbookList";

interface JobStatus {
  id: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
  progress: number;
  totalPages?: number;
  currentPage?: number;
  error?: string;
  wordBookId: string;
  createdAt: string;
  completedAt?: string;
}

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
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!selectedWordbookId) {
      alert("낱말집을 선택해주세요.");
      return;
    }

    setIsExporting(true);
    
    try {
      // 작업 시작
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wordBookId: selectedWordbookId }),
      });

      if (!response.ok) {
        throw new Error('작업 시작에 실패했습니다.');
      }

      const { jobId } = await response.json();
      
      // 작업 상태 모니터링 시작
      pollJobStatus(jobId);

    } catch (error) {
      console.error("Export failed:", error);
      alert("내보내기에 실패했습니다.");
      setIsExporting(false);
    }
  };

  const pollJobStatus = async (jobId: string) => {
    const poll = async () => {
      try {
        const response = await fetch(`/api/status/${jobId}`);
        
        if (!response.ok) {
          throw new Error('상태 확인에 실패했습니다.');
        }

        const status: JobStatus = await response.json();
        setJobStatus(status);

        if (status.status === 'completed') {
          setIsExporting(false);
          // 자동 다운로드 시작
          downloadFile(jobId);
        } else if (status.status === 'failed') {
          setIsExporting(false);
          alert(`작업 실패: ${status.error}`);
        } else if (status.status === 'active' || status.status === 'pending') {
          // 1초 후 다시 확인
          setTimeout(poll, 1000);
        }

      } catch (error) {
        console.error('Status polling failed:', error);
        setIsExporting(false);
        alert('작업 상태 확인에 실패했습니다.');
      }
    };

    poll();
  };

  const downloadFile = async (jobId: string) => {
    try {
      const response = await fetch(`/api/download/${jobId}`);
      
      if (!response.ok) {
        throw new Error('파일 다운로드에 실패했습니다.');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wordbook_${selectedWordbookId}.tsv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (error) {
      console.error('Download failed:', error);
      alert('파일 다운로드에 실패했습니다.');
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

      {/* 진행 상태 표시 */}
      {jobStatus && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-800">
              {jobStatus.status === 'pending' && '작업 대기 중...'}
              {jobStatus.status === 'active' && '단어 수집 중...'}
              {jobStatus.status === 'completed' && '완료!'}
              {jobStatus.status === 'failed' && '실패'}
            </span>
            {jobStatus.status === 'active' && (
              <span className="text-sm text-blue-600">
                {jobStatus.currentPage}/{jobStatus.totalPages} 페이지
              </span>
            )}
          </div>
          
          {jobStatus.status === 'active' && (
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${jobStatus.progress}%` }}
              ></div>
            </div>
          )}
          
          {jobStatus.status === 'failed' && (
            <p className="text-sm text-red-600 mt-1">{jobStatus.error}</p>
          )}
        </div>
      )}

      <div className="text-center">
        <button
          onClick={handleExport}
          disabled={!selectedWordbookId || isExporting}
          className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 mx-auto ${
            selectedWordbookId && !isExporting
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isExporting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              처리 중...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              TSV 파일로 내보내기
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default TsvExportForm;
