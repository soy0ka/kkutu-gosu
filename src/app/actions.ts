import apiClient from "~/lib/client/request";

interface WordbookResponse {
  page: number;
  pageCount: number;
  count: number;
  list: WordBook[];
}

export interface WordBook {
  sid: string;
  published: boolean;
  title: string;
  locale: string;
  description: string;
  coverImageStyle: string | null;
  version: number;
  updatedAt: number;
  subscriptionCount: number;
  wordCount: number;
  samples: string[];
  subscribing: boolean;
}

export const getWordbookList = async () => {
  const URL = 'https://kkutu.kr/api/wordbook/search?order=recent'
  const response = await apiClient.get<WordbookResponse>(URL, {})
  console.log(response)
  if (response.status !== 200) {
    throw new Error('낱말집을 불러오지 못했습니다. 다시 시도해주세요.')
  }

  return response.data

}
