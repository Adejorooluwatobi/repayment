import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CaseNotesService } from './case-notes.service';
import { CaseNote } from './schemas/case-note.schema';
import { CreateCaseNoteDto } from './dto/create-case-note.dto';
import { UpdateCaseNoteDto } from './dto/update-case-note.dto';

@ApiTags('Case Notes')
@Controller('case-notes')
export class CaseNotesController {
  constructor(private readonly caseNotesService: CaseNotesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new case note' })
  @ApiResponse({ status: 201, description: 'Note created successfully', type: CaseNote })
  async create(@Body() createCaseNoteDto: CreateCaseNoteDto): Promise<CaseNote> {
    return this.caseNotesService.create(createCaseNoteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all case notes' })
  @ApiResponse({ status: 200, description: 'Return all notes', type: [CaseNote] })
  async findAll(): Promise<CaseNote[]> {
    return this.caseNotesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a case note by ID' })
  @ApiResponse({ status: 200, description: 'Return a single note', type: CaseNote })
  async findOne(@Param('id') id: string): Promise<CaseNote> {
    return this.caseNotesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a case note' })
  @ApiResponse({ status: 200, description: 'Note updated successfully', type: CaseNote })
  async update(@Param('id') id: string, @Body() updateCaseNoteDto: UpdateCaseNoteDto): Promise<CaseNote> {
    return this.caseNotesService.update(id, updateCaseNoteDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a case note' })
  @ApiResponse({ status: 200, description: 'Note deleted successfully' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.caseNotesService.remove(id);
  }
}
