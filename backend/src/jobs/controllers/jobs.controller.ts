import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { JobsService, Job } from '../services/jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  async createJob(): Promise<{ id: string }> {
    const jobId = await this.jobsService.createJob();
    return { id: jobId };
  }

  @Get()
  async getAllJobs(): Promise<Job[]> {
    return this.jobsService.getAllJobs();
  }

  @Get(':id')
  async getJobById(@Param('id') id: string): Promise<Job> {
    return this.jobsService.getJobById(id);
  }
}