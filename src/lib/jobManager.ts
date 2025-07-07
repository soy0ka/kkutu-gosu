import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// 작업 상태 타입 정의
export interface JobStatus {
  id: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
  progress: number;
  totalPages?: number;
  currentPage?: number;
  error?: string;
  wordBookId: string;
  createdAt: Date;
  completedAt?: Date;
  fileName?: string;
}

// 메모리 기반 작업 저장소 + 파일 백업
const jobs = new Map<string, JobStatus>();

// 임시 파일 저장 디렉토리
const TEMP_DIR = path.join(process.cwd(), 'temp');
const JOBS_DIR = path.join(TEMP_DIR, 'jobs');

// 임시 디렉토리 생성
async function ensureTempDir() {
  try {
    await fs.access(TEMP_DIR);
  } catch {
    await fs.mkdir(TEMP_DIR, { recursive: true });
  }
  try {
    await fs.access(JOBS_DIR);
  } catch {
    await fs.mkdir(JOBS_DIR, { recursive: true });
  }
}

// 작업을 파일에 저장
async function saveJobToFile(job: JobStatus) {
  await ensureTempDir();
  const filePath = path.join(JOBS_DIR, `${job.id}.json`);
  await fs.writeFile(filePath, JSON.stringify(job, null, 2), 'utf-8');
}

// 파일에서 작업 로드
async function loadJobFromFile(jobId: string): Promise<JobStatus | null> {
  try {
    await ensureTempDir();
    const filePath = path.join(JOBS_DIR, `${jobId}.json`);
    const content = await fs.readFile(filePath, 'utf-8');
    const job = JSON.parse(content);
    // Date 객체 복원
    job.createdAt = new Date(job.createdAt);
    if (job.completedAt) job.completedAt = new Date(job.completedAt);
    return job;
  } catch {
    return null;
  }
}

// 새 작업 생성
export async function createJob(wordBookId: string): Promise<string> {
  const jobId = uuidv4();
  const job: JobStatus = {
    id: jobId,
    status: 'pending',
    progress: 0,
    wordBookId,
    createdAt: new Date()
  };
  
  jobs.set(jobId, job);
  await saveJobToFile(job);
  console.log(`Created job ${jobId} for wordbook ${wordBookId}`);
  console.log(`Total jobs in memory: ${jobs.size}`);
  return jobId;
}

// 작업 상태 업데이트
export async function updateJobStatus(jobId: string, updates: Partial<JobStatus>) {
  console.log(`Updating job ${jobId} with:`, updates);
  let job = jobs.get(jobId);
  
  // 메모리에 없으면 파일에서 로드
  if (!job) {
    const loadedJob = await loadJobFromFile(jobId);
    if (loadedJob) {
      job = loadedJob;
      jobs.set(jobId, job);
    }
  }
  
  if (!job) {
    console.error(`Job ${jobId} not found for update!`);
    throw new Error('작업을 찾을 수 없습니다.');
  }
  
  Object.assign(job, updates);
  jobs.set(jobId, job);
  await saveJobToFile(job);
  console.log(`Job ${jobId} updated successfully. Current status: ${job.status}`);
}

// 작업 상태 조회
export async function getJobStatus(jobId: string): Promise<JobStatus | null> {
  console.log(`Looking for job ${jobId}`);
  console.log(`Available jobs in memory: ${Array.from(jobs.keys()).join(', ')}`);
  
  let job = jobs.get(jobId) || null;
  
  // 메모리에 없으면 파일에서 로드
  if (!job) {
    console.log(`Job not in memory, trying to load from file...`);
    const loadedJob = await loadJobFromFile(jobId);
    if (loadedJob) {
      job = loadedJob;
      jobs.set(jobId, job);
      console.log(`Loaded job ${jobId} from file`);
    }
  }
  
  console.log(`Found job:`, job ? 'YES' : 'NO');
  return job;
}

// TSV 파일 저장
export async function saveTsvFile(jobId: string, content: string): Promise<string> {
  await ensureTempDir();
  const fileName = `wordbook_${jobId}.tsv`;
  const filePath = path.join(TEMP_DIR, fileName);
  
  await fs.writeFile(filePath, content, 'utf-8');
  
  // 작업 상태 업데이트
  await updateJobStatus(jobId, { fileName });
  
  return fileName;
}

// TSV 파일 읽기
export async function getTsvFile(jobId: string): Promise<Buffer | null> {
  const job = await getJobStatus(jobId);
  if (!job || !job.fileName) {
    return null;
  }
  
  const filePath = path.join(TEMP_DIR, job.fileName);
  
  try {
    return await fs.readFile(filePath);
  } catch {
    return null;
  }
}

// 작업 정리 (1시간 후 자동 삭제)
export function cleanupJob(jobId: string) {
  setTimeout(async () => {
    const job = await getJobStatus(jobId);
    if (job && job.fileName) {
      const filePath = path.join(TEMP_DIR, job.fileName);
      try {
        await fs.unlink(filePath);
      } catch {
        // 파일이 이미 없을 수 있음
      }
      
      // job 파일도 삭제
      try {
        const jobFilePath = path.join(JOBS_DIR, `${jobId}.json`);
        await fs.unlink(jobFilePath);
      } catch {
        // 파일이 이미 없을 수 있음
      }
    }
    jobs.delete(jobId);
  }, 60 * 60 * 1000); // 1시간
}
