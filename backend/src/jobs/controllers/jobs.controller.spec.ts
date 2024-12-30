import { Test, TestingModule } from '@nestjs/testing';
import { JobsController } from './jobs.controller';
import { JobsService, Job } from './jobs.service';
import { NotFoundException } from '@nestjs/common';

describe('JobsController', () => {
  let controller: JobsController;
  let service: JobsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobsController],
      providers: [
        {
          provide: JobsService,
          useValue: {
            createJob: jest.fn(),
            getAllJobs: jest.fn(),
            getJobById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<JobsController>(JobsController);
    service = module.get<JobsService>(JobsService);
  });

  it('should create a new job', async () => {
    const jobId = 'test-job-id';
    jest.spyOn(service, 'createJob').mockResolvedValue(jobId);

    const result = await controller.createJob();
    expect(result).toEqual({ id: jobId });
    expect(service.createJob).toHaveBeenCalled();
  });

  it('should return all jobs', async () => {
    const jobs: Job[] = [{ id: 'test-job-id', status: 'pending', result: null }];
    jest.spyOn(service, 'getAllJobs').mockResolvedValue(jobs);

    const result = await controller.getAllJobs();
    expect(result).toEqual(jobs);
    expect(service.getAllJobs).toHaveBeenCalled();
  });

  it('should return a job by ID', async () => {
    const job: Job = { id: 'test-job-id', status: 'pending', result: null };
    jest.spyOn(service, 'getJobById').mockResolvedValue(job);

    const result = await controller.getJobById('test-job-id');
    expect(result).toEqual(job);
    expect(service.getJobById).toHaveBeenCalledWith('test-job-id');
  });

  it('should throw NotFoundException for invalid job ID', async () => {
    jest.spyOn(service, 'getJobById').mockRejectedValue(new NotFoundException());

    await expect(controller.getJobById('invalid-id')).rejects.toThrow(NotFoundException);
    expect(service.getJobById).toHaveBeenCalledWith('invalid-id');
  });
});