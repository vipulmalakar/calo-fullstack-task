import { Module, forwardRef } from '@nestjs/common';
import { JobsController } from './controllers/jobs.controller';
import { JobsService } from './services/jobs.service';
import { JobsGateway } from './gateways/jobs.gateway';

@Module({
  controllers: [JobsController],
  providers: [JobsService, JobsGateway],
  exports: [JobsService],
})
export class JobsModule {}
