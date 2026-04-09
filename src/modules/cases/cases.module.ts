import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CasesController } from './cases.controller';
import { CasesService } from './cases.service';
import { Case, CaseSchema } from './schemas/case.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Case.name, schema: CaseSchema }]),
  ],
  controllers: [CasesController],
  providers: [CasesService],
  exports: [CasesService],
})
export class CasesModule {}
