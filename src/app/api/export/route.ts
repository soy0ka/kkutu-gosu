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
    console.log(`Export started for job ${jobId}, wordbook ${wordBookId}`);
    
    // 백그라운드에서 단어 수집 작업 시작
    console.log(`About to start processWordCollection for job ${jobId}...`);
    processWordCollection(jobId, wordBookId)
      .then((result) => {
        console.log(`Background job ${jobId} completed successfully:`, result);
      })
      .catch((error) => {
        console.error(`Background job ${jobId} failed:`, error);
        console.error('Error stack:', error.stack);
      });
    
    console.log(`Export API response sent for job ${jobId}`);
    
    return NextResponse.json({ 
      jobId,
      message: '단어 수집 작업이 시작되었습니다.' 
    });
    
  } catch (error) {
    console.error('Export API Error:', error);
    return NextResponse.json(
      { error: '작업 생성에 실패했습니다.' }, 
      { status: 500 }
    );
  }
}
