import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CaseNote } from './schemas/case-note.schema';
import { CreateCaseNoteDto } from './dto/create-case-note.dto';
import { UpdateCaseNoteDto } from './dto/update-case-note.dto';

@Injectable()
export class CaseNotesService {
  constructor(@InjectModel(CaseNote.name) private noteModel: Model<CaseNote>) {}

  async create(createCaseNoteDto: CreateCaseNoteDto | any): Promise<CaseNote> {
    const newNote = new this.noteModel(createCaseNoteDto);
    return newNote.save();
  }

  async findAll(): Promise<CaseNote[]> {
    return this.noteModel.find().populate('caseId adminId').exec();
  }

  async findOne(id: string): Promise<CaseNote> {
    const note = await this.noteModel.findById(id).populate('caseId adminId').exec();
    if (!note) throw new NotFoundException(`Case Note with ID ${id} not found`);
    return note;
  }

  async update(id: string, updateCaseNoteDto: UpdateCaseNoteDto): Promise<CaseNote> {
    const updatedNote = await this.noteModel
      .findByIdAndUpdate(id, updateCaseNoteDto, { new: true })
      .exec();
    if (!updatedNote) throw new NotFoundException(`Case Note with ID ${id} not found`);
    return updatedNote;
  }

  async remove(id: string): Promise<void> {
    const result = await this.noteModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Case Note with ID ${id} not found`);
  }
}
