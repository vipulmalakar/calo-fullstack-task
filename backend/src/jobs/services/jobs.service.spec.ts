import { Test, TestingModule } from '@nestjs/testing';
import { JobsService, Job } from './jobs.service';
import { JobsGateway } from '../gateways/jobs.gateway';
import * as fs from 'fs/promises';
import { NotFoundException } from '@nestjs/common';

jest.mock('fs/promises');

describe('JobsService', () => {
  let service: JobsService;
  let gateway: JobsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobsService,
        JobsGateway,
      ],
    }).compile();

    service = module.get<JobsService>(JobsService);
    gateway = module.get<JobsGateway>(JobsGateway);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new job', async () => {
    const jobId = await service.createJob();
    expect(jobId).toBeDefined();
    const jobs = await service.getAllJobs();
    expect(jobs).toHaveLength(1);
    expect(jobs[0].id).toBe(jobId);
  });

  it('should get all jobs', async () => {
    await service.createJob();
    const jobs = await service.getAllJobs();
    expect(jobs).toHaveLength(1);
  });

  it('should get a job by ID', async () => {
    const jobId = await service.createJob();
    const job = await service.getJobById(jobId);
    expect(job.id).toBe(jobId);
  });

  it('should throw NotFoundException for invalid job ID', async () => {
    await expect(service.getJobById('invalid-id')).rejects.toThrow(NotFoundException);
  });

  it('should save jobs to file', async () => {
    const jobId = await service.createJob();
    const jobs = await service.getAllJobs();
    expect(fs.writeFile).toHaveBeenCalledWith(expect.any(String), JSON.stringify(jobs, null, 2));
  });

  it('should get jobs from file', async () => {
    const jobId = await service.createJob();
    const jobs = await service.getAllJobs();
    expect(fs.readFile).toHaveBeenCalledWith(expect.any(String), 'utf8');
    expect(jobs).toHaveLength(1);
  });
});
