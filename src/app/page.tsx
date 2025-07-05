import Image from "next/image";
import Chobo from "~/assets/images/chobo.webp";
import Hacking from "~/assets/images/hacking.webp";
import WordbookCard from "~/components/WordbookCard";
import { getWordbookList } from "./actions";


export default async function Home() {

  const wordbooks = await getWordbookList()
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
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center space-x-2">
              낱말집
              <Image
                src={Hacking}
                alt="moremi_sign hacking"
                className="w-10 h-10 mb-1"
              />해서 TSV로 내보내기
            </h2>
          </div>
        </div>
      <div className="mt-6 grid grid-cols-2 gap-4 bg-[#fff] p-4 rounded-lg shadow">
        {wordbooks.list.map((wordbook) => (
          <WordbookCard
            key={wordbook.sid}
            title={wordbook.title}
            words={wordbook.samples}
            wordCount={wordbook.wordCount}
            userCount={wordbook.subscriptionCount}
          />
          ))
        }
      </div>
      </main>
    </div>
  );
}
