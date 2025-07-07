import { NextRequest, NextResponse } from 'next/server';
import { getJobStatus, getTsvFile } from '~/lib/jobManager';

export async function GET(
  req: NextRequest,
  context: { params: { jobId: string } }
) {
  try {
    const { jobId } = context.params;
    
    const job = await getJobStatus(jobId);
    
    if (!job) {
      return NextResponse.json(
        { error: '작업을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    if (job.status !== 'completed') {
      return NextResponse.json(
        { error: '작업이 아직 완료되지 않았습니다.' },
        { status: 400 }
      );
    }

    const fileBuffer = await getTsvFile(jobId);
    
    if (!fileBuffer) {
      return NextResponse.json(
        { error: '파일을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // TSV 파일 다운로드 응답
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'text/tab-separated-values; charset=utf-8',
        'Content-Disposition': `attachment; filename="wordbook_${job.wordBookId}.tsv"`,
      },
    });

  } catch (error) {
    console.error('Download API error:', error);
    return NextResponse.json(
      { error: '파일 다운로드에 실패했습니다.' },
      { status: 500 }
    );
  }
}
