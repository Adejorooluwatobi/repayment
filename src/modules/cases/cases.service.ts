import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Case } from './entities/case.entity';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';

@Injectable()
export class CasesService {
  constructor(
    @InjectRepository(Case)
    private readonly caseRepository: Repository<Case>,
  ) {}

  async create(createCaseDto: CreateCaseDto): Promise<Case> {
    const newCase = this.caseRepository.create(createCaseDto as DeepPartial<Case>);
    return this.caseRepository.save(newCase);
  }

  async findAll(): Promise<Case[]> {
    return this.caseRepository.find({
      relations: { client: true, assignedAdmin: true },
    });
  }

  async findOne(id: string): Promise<Case> {
    const caseItem = await this.caseRepository.findOne({
      where: { id },
      relations: { client: true, assignedAdmin: true },
    });
    if (!caseItem) throw new NotFoundException(`Case with ID ${id} not found`);
    return caseItem;
  }

  async update(id: string, updateCaseDto: UpdateCaseDto): Promise<Case> {
    const caseItem = await this.findOne(id);
    Object.assign(caseItem, updateCaseDto);
    return this.caseRepository.save(caseItem);
  }

  async remove(id: string): Promise<void> {
    const result = await this.caseRepository.delete(id);
    if (!result.affected) throw new NotFoundException(`Case with ID ${id} not found`);
  }
}
