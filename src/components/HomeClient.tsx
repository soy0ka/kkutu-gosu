"use client";

import Image from "next/image";
import { useState } from "react";
import Chobo from "~/assets/images/chobo.webp";
import TsvExportForm from "~/components/TsvExportForm";

interface Wordbook {
  sid: string;
  title: string;
  samples: string[];
  wordCount: number;
  subscriptionCount: number;
}

interface HomeClientProps {
  initialWordbooks: { list: Wordbook[] };
}

export default function HomeClient({ initialWordbooks }: HomeClientProps) {
  const [selectedWordbookId, setSelectedWordbookId] = useState<string | null>(null);

  const selectedWordbook = selectedWordbookId 
    ? initialWordbooks.list.find(wb => wb.sid === selectedWordbookId) 
    : null;

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Image
                src={Chobo}
                alt="끄투고수 로고"
                className="w-8 h-8"
              />
              <h1 className="text-xl font-extrabold text-gray-800">끄투고수</h1>
            </div>
          </div>
        </div>
      </header>
  
      <main className="max-w-4xl mx-auto px-4 py-12">
        <TsvExportForm 
          wordbooks={initialWordbooks.list}
          selectedWordbookId={selectedWordbookId} 
          selectedWordbook={selectedWordbook}
          onWordbookSelect={setSelectedWordbookId}
        />
      </main>
    </div>
  );
}
