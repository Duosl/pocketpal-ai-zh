import axios from 'axios';
import {urls} from '../config';
import {BenchmarkResult, DeviceInfo} from '../utils/types';

type SubmissionData = {
  deviceInfo: DeviceInfo;
  benchmarkResult: BenchmarkResult;
};

export async function submitBenchmark(
  deviceInfo: DeviceInfo,
  benchmarkResult: BenchmarkResult,
): Promise<{message: string; id: number}> {
  try {
    const data: SubmissionData = {
      deviceInfo,
      benchmarkResult,
    };

    const response = await axios.post(urls.benchmarkSubmit(), data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting benchmark:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    throw error;
  }
}
