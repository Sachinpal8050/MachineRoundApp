import {JobPostType} from '../types';

const BASE_URL = 'https://testapi.getlokalapp.com/common/jobs';

export const controller = new AbortController();

export const getJobListingData = async (
  page: number,
  signal: any,
): Promise<JobPostType[]> => {
  await wait(5000);
  const data = await fetch(`${BASE_URL}?page=${page}`, {
    signal: signal,
  }).then(res => res.json());
  return data.results;
};

const wait = (delay: number) => {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
};
