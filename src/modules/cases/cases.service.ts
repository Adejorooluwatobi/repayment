import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Case } from './schemas/case.schema';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';

@Injectable()
export class CasesService {
  constructor(@InjectModel(Case.name) private caseModel: Model<Case>) {}

  async create(createCaseDto: CreateCaseDto | any): Promise<Case> {
    const newCase = new this.caseModel(createCaseDto);
    return newCase.save();
  }

  async findAll(): Promise<Case[]> {
    return this.caseModel.find().populate('clientId assignedAdminId').exec();
  }

  async findOne(id: string): Promise<Case> {
    const caseItem = await this.caseModel.findById(id).populate('clientId assignedAdminId').exec();
    if (!caseItem) throw new NotFoundException(`Case with ID ${id} not found`);
    return caseItem;
  }

  async update(id: string, updateCaseDto: UpdateCaseDto): Promise<Case> {
    const updatedCase = await this.caseModel
      .findByIdAndUpdate(id, updateCaseDto, { new: true })
      .exec();
    if (!updatedCase) throw new NotFoundException(`Case with ID ${id} not found`);
    return updatedCase;
  }

  async remove(id: string): Promise<void> {
    const result = await this.caseModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Case with ID ${id} not found`);
  }
}
