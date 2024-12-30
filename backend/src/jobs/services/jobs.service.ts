import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { createApi } from 'unsplash-js';
import * as nodeFetch from 'node-fetch';
import { JobsGateway } from '../gateways/jobs.gateway';

global.fetch = nodeFetch.default;

export interface Job {
  id: string;
  status: 'pending' | 'resolved' | 'failed';
  result: string | null;
}

@Injectable()
export class JobsService {
  private readonly jobsFile = path.resolve(__dirname, '../database/jobs.json');
  private readonly jobsDir = path.dirname(this.jobsFile);
  private readonly unsplash;

  constructor(
    @Inject(forwardRef(() => JobsGateway))
    private readonly jobsGateway: JobsGateway,
    private readonly configService: ConfigService
  ) {
    this.ensureJobsDirectoryExists().then(() => {
      fs.writeFile(this.jobsFile, JSON.stringify([]), { flag: 'wx' }).catch(() => {});
    });

    this.unsplash = createApi({
      accessKey: this.configService.get<string>('UNSPLASH_ACCESS_KEY'),
      fetch: nodeFetch.default as unknown as typeof fetch,
    });
  }

  // Ensure the jobs directory exists
  private async ensureJobsDirectoryExists(): Promise<void> {
    try {
      await fs.mkdir(this.jobsDir, { recursive: true });
    } catch (error) {
      console.error('Error creating jobs directory:', error);
    }
  }

  // Create a new job and initiate processing
  async createJob(): Promise<string> {
    const jobId = uuidv4();
    const newJob: Job = { id: jobId, status: 'pending', result: null };
    const jobs = await this.getJobsFromFile();
    jobs.push(newJob);
    await this.saveJobsToFile(jobs);
    this.simulateJobProcessing(jobId);
    return jobId;
  }

  // Get all jobs
  async getAllJobs(): Promise<Job[]> {
    return this.getJobsFromFile();
  }

  // Get a specific job by ID
  async getJobById(id: string): Promise<Job> {
    const jobs = await this.getJobsFromFile();
    const job = jobs.find(job => job.id === id);
    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }
    return job;
  }

  // Simulate job processing with a random delay
  private async simulateJobProcessing(jobId: string): Promise<void> {
    const delay = Math.floor(Math.random() * 12 + 1) * 5000; // Random delay between 5s and 5m
    setTimeout(async () => {
      const jobs = await this.getJobsFromFile();
      const job = jobs.find(job => job.id === jobId);
      if (job) {
        try {
          const response = await this.unsplash.photos.getRandom({ query: 'food' });
          if (response.type === 'success' && !Array.isArray(response.response)) {
            job.status = 'resolved';
            job.result = response.response.urls.full;
          } else {
            throw new Error('Failed to retrieve image');
          }
        } catch (error) {
          job.status = 'failed';
          job.result = 'Failed to retrieve image';
        }
        await this.saveJobsToFile(jobs);
        this.jobsGateway.notifyJobUpdate(job);
      }
    }, delay);
  }

  // Get jobs from the file
  private async getJobsFromFile(): Promise<Job[]> {
    const data = await fs.readFile(this.jobsFile, 'utf8');
    return JSON.parse(data);
  }

  // Save jobs to the file
  private async saveJobsToFile(jobs: Job[]): Promise<void> {
    await fs.writeFile(this.jobsFile, JSON.stringify(jobs, null, 2));
  }
}