import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('JobsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should create a new job', () => {
    return request(app.getHttpServer())
      .post('/jobs')
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
      });
  });

  it('should return all jobs', async () => {
    await request(app.getHttpServer()).post('/jobs'); // Create a job first
    return request(app.getHttpServer())
      .get('/jobs')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
      });
  });

  it('should return a job by ID', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/jobs')
      .expect(201);

    const jobId = createResponse.body.id;
    return request(app.getHttpServer())
      .get(`/jobs/${jobId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id', jobId);
        expect(res.body).toHaveProperty('status');
      });
  });

  it('should return 404 for an invalid job ID', () => {
    return request(app.getHttpServer())
      .get('/jobs/invalid-id')
      .expect(404)
      .expect((res) => {
        expect(res.body).toHaveProperty('statusCode', 404);
        expect(res.body).toHaveProperty('message', 'Job with ID invalid-id not found');
      });
  });

  afterAll(async () => {
    await app.close();
  });
});