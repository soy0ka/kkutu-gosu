import { NextRequest, NextResponse } from 'next/server';
import { cleanupJob, createJob } from '~/lib/jobManager';
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
    
    // 백그라운드에서 작업 실행
    processWordCollection(jobId, wordBookId)
      .catch(error => {
        console.error('Word collection failed:', error);
      });
    
    // 1시간 후 정리 작업 예약
    cleanupJob(jobId);

    return NextResponse.json({ 
      jobId,
      message: '단어 수집 작업이 시작되었습니다.'
    });

  } catch (error) {
    console.error('Export API error:', error);
    return NextResponse.json(
      { error: '작업 시작에 실패했습니다.' },
      { status: 500 }
    );
  }
}
