import { Module } from '@nestjs/common';
import { ReadExtractService } from './read-extract.service';
import { ReadExtractController } from './read-extract.controller';

@Module({
  controllers: [ReadExtractController],
  providers: [ReadExtractService],
})
export class ReadExtractModule {}
