import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { CaseNote } from './entities/case-note.entity';
import { CreateCaseNoteDto } from './dto/create-case-note.dto';
import { UpdateCaseNoteDto } from './dto/update-case-note.dto';

@Injectable()
export class CaseNotesService {
  constructor(
    @InjectRepository(CaseNote)
    private readonly caseNoteRepository: Repository<CaseNote>,
  ) {}

  async create(createCaseNoteDto: CreateCaseNoteDto): Promise<CaseNote> {
    const newNote = this.caseNoteRepository.create(createCaseNoteDto as DeepPartial<CaseNote>);
    return this.caseNoteRepository.save(newNote);
  }

  async findAll(): Promise<CaseNote[]> {
    return this.caseNoteRepository.find({
      relations: { case: true, admin: true },
    });
  }

  async findOne(id: string): Promise<CaseNote> {
    const note = await this.caseNoteRepository.findOne({
      where: { id },
      relations: { case: true, admin: true },
    });
    if (!note) throw new NotFoundException(`Case Note with ID ${id} not found`);
    return note;
  }

  async update(id: string, updateCaseNoteDto: UpdateCaseNoteDto): Promise<CaseNote> {
    const note = await this.findOne(id);
    Object.assign(note, updateCaseNoteDto);
    return this.caseNoteRepository.save(note);
  }

  async remove(id: string): Promise<void> {
    const result = await this.caseNoteRepository.delete(id);
    if (!result.affected) throw new NotFoundException(`Case Note with ID ${id} not found`);
  }
}
