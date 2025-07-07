import { NextRequest, NextResponse } from 'next/server';
import { createJob } from '~/lib/jobManager';
import { processWordCollection } from '~/lib/wordProcessor';

export async function POST(request: NextRequest) {
  try {
    const { wordBookId } = await request.json();
    
    if (!wordBookId) {
      return NextResponse.json(
        { error: '낱말집 ID가 필요합니다.' }, 
        { status: 400 }
      );
    }
    
    // 새 작업 생성
    const jobId = await createJob(wordBookId);
    console.log(`Test API: Created job ${jobId} for wordbook ${wordBookId}`);
    
    // 즉시 단어 수집 시작 (await로 동기 실행)
    try {
      console.log(`Test API: Starting processWordCollection...`);
      const result = await processWordCollection(jobId, wordBookId);
      console.log(`Test API: processWordCollection completed:`, result);
      
      return NextResponse.json({ 
        jobId,
        result,
        message: '단어 수집이 완료되었습니다.' 
      });
    } catch (processError) {
      console.error(`Test API: processWordCollection failed:`, processError);
      return NextResponse.json({ 
        jobId,
        error: processError instanceof Error ? processError.message : 'Unknown error',
        message: '단어 수집에 실패했습니다.' 
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Test API Error:', error);
    return NextResponse.json(
      { error: '테스트 API 실행에 실패했습니다.' }, 
      { status: 500 }
    );
  }
}
