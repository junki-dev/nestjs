import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocController } from './doc.controller';
import { Doc } from './doc.entity';
import { DocService } from './doc.service';

@Module({
  imports: [TypeOrmModule.forFeature([Doc])],
  exports: [DocService],
  controllers: [DocController],
  providers: [DocService],
})
export class DocModule {}
