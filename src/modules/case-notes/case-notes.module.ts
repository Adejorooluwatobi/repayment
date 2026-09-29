import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaseNotesController } from './case-notes.controller';
import { CaseNotesService } from './case-notes.service';
import { CaseNote } from './entities/case-note.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CaseNote])],
  controllers: [CaseNotesController],
  providers: [CaseNotesService],
  exports: [CaseNotesService, TypeOrmModule],
})
export class CaseNotesModule {}
