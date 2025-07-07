import { NextResponse } from 'next/server';

// 메모리에서 모든 작업 초기화 (개발용)
const jobs = new Map();

export async function DELETE() {
  try {
    // 메모리 초기화
    jobs.clear();
    
    console.log('All jobs cleared from memory');
    
    return NextResponse.json({ 
      message: '모든 작업이 초기화되었습니다.' 
    });
    
  } catch (error) {
    console.error('Clear jobs error:', error);
    return NextResponse.json(
      { error: '작업 초기화에 실패했습니다.' },
      { status: 500 }
    );
  }
}
