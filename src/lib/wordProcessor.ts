/* eslint-disable @typescript-eslint/no-explicit-any */
import { saveTsvFile, updateJobStatus } from './jobManager';

// API 응답 타입 정의
interface KkutuApiResponse {
  pageCount?: number;
  list?: any[];
}

interface WordData {
  name?: string;
  displayName?: string;
  part?: string;
  flags?: string;
  meanings?: Array<{ 
    seq?: number;
    categoryId?: number | null;
    payload?: string;
  }>;
  [key: string]: any; // 다른 필드들도 접근 가능하게
}

// 로깅 플래그
let hasLoggedWordStructure = false;

// 단어 데이터 처리 함수 - 각 의미마다 별도의 행을 생성
const processWordData = (word: WordData): Array<{[key: string]: string}> => {
  // 디버깅을 위해 단어 객체의 모든 키 로깅 (첫 번째 단어만)
  if (!hasLoggedWordStructure) {
    console.log('Word object keys:', Object.keys(word));
    console.log('Sample word data:', word);
    hasLoggedWordStructure = true;
  }

  const baseData = {
    '표제어': word.name ?? '',
    '입력어': word.displayName ?? '',
    '품사': word.part ?? '',
    '플래그': word.flags?.toString() ?? '',
  };

  // meanings가 없거나 빈 배열인 경우 기본 행 하나 생성
  if (!word.meanings || word.meanings.length === 0) {
    return [{
      ...baseData,
      '주제': '0',
      '뜻': ''
    }];
  }

  // 각 meaning마다 별도의 행 생성
  return word.meanings.map(meaning => ({
    ...baseData,
    '주제': (meaning.categoryId ?? 0).toString(),
    '뜻': meaning.payload ?? ''
  }));
};

// 페이지별 단어 가져오기
const fetchWords = async (page: number, wordBookId: string = '1'): Promise<KkutuApiResponse> => {
  const url = `https://kkutu.kr/api/wordbook/${wordBookId}/words?q=&page=${page}`;
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  };
  
  const response = await fetch(url, { headers });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  return await response.json() as KkutuApiResponse;
};
// 단어 수집 작업 프로세서
export const processWordCollection = async (jobId: string, wordBookId: string) => {
  console.log(`Starting word collection for job ${jobId}, wordbook ${wordBookId}`);
  try {
    // 작업 시작
    await updateJobStatus(jobId, { 
      status: 'active',
      progress: 0 
    });

    console.log(`Job ${jobId}: Fetching first page to get total page count...`);
    // 첫 페이지로 총 페이지 수 확인
    const testData = await fetchWords(0, wordBookId);
    
    console.log(`Job ${jobId}: First page response:`, testData);
    
    if (!testData.pageCount) {
      throw new Error('잘못된 응답이거나 접근 권한이 없습니다.');
    }

    const totalPages = testData.pageCount;
    
    await updateJobStatus(jobId, { 
      totalPages,
      currentPage: 0
    });

    const allWords: any[] = [];

    // 각 페이지 순회하며 단어 수집
    for (let page = 0; page < totalPages; page++) {
      const data = await fetchWords(page, wordBookId);
      
      if (data.list) {
        const pageWords = data.list.flatMap(processWordData);
        allWords.push(...pageWords);
      }

      const progress = ((page + 1) / totalPages) * 100;
      
      await updateJobStatus(jobId, { 
        currentPage: page + 1,
        progress 
      });

      // 지연 시간 추가 (서버 부하 방지)
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // TSV 형식으로 변환
    const headers = ['표제어', '입력어', '품사', '플래그', '주제', '뜻'];
    const tsvContent = [
      headers.join('\t'),
      ...allWords.map(word => 
        headers.map(header => {
          const value = word[header];
          return (value !== null && value !== undefined ? value : '').toString().replace(/\t/g, ' ');
        }).join('\t')
      )
    ].join('\n');

    // 결과 저장
    await updateJobStatus(jobId, { 
      status: 'completed',
      progress: 100,
      completedAt: new Date()
    });

    // TSV 파일 저장
    await saveTsvFile(jobId, tsvContent);

    return { 
      totalWords: allWords.length, 
      message: '단어 수집이 완료되었습니다.' 
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
    
    console.error(`Word collection failed for job ${jobId}:`, error);
    
    await updateJobStatus(jobId, { 
      status: 'failed',
      error: errorMessage 
    });

    throw error;
  }
};
