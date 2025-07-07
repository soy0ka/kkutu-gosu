import { NextRequest, NextResponse } from 'next/server';
import { getJobStatus } from '~/lib/jobManager';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params;
    
    const job = await getJobStatus(jobId);
    
    if (!job) {
      return NextResponse.json(
        { error: '작업을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    console.log(`Job ${jobId} status:`, job.status, `progress: ${job.progress}%`);
    return NextResponse.json(job);

  } catch (error) {
    console.error('Job status API error:', error);
    return NextResponse.json(
      { error: '작업 상태를 확인할 수 없습니다.' },
      { status: 500 }
    );
  }
}
