import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CaseNotesController } from './case-notes.controller';
import { CaseNotesService } from './case-notes.service';
import { CaseNote, CaseNoteSchema } from './schemas/case-note.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CaseNote.name, schema: CaseNoteSchema }]),
  ],
  controllers: [CaseNotesController],
  providers: [CaseNotesService],
  exports: [CaseNotesService],
})
export class CaseNotesModule {}
