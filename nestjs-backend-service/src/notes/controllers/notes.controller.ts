import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';

import { NoteDto } from '../dto/note.dto';
import { NoteInterface } from '../models/note.interface';
import { NotesService } from '../services/notes.service';

@Controller('notes')
export class NotesController {
    
    constructor(private readonly notesService: NotesService) {}

    @Post()
    async addNote(@Body() noteDto: NoteDto) {
        const generatedNote = await this.notesService.addNote(noteDto);
        return generatedNote;
    }
    
    @Get()
    async getAllNotes(): Promise<NoteInterface[]> {
        const notes = this.notesService.getAllNotes();
        return notes;
    }

    @Get(':id')
    async getSelectedNote(@Param('id') noteId: string, @Res() res: any) {
        const note = await this.notesService.getSelectedNote(noteId);
        if (!note) {
            return res
                .status(HttpStatus.NOT_FOUND)
                .json({ status: 404, error: "Not found!" });
        }
        
        return res
        .status(HttpStatus.OK)
        .json({data: note});
    }

    @Put(':id')
    async editNote(@Param('id') noteId: string, @Body() noteDto: NoteDto) {
        const editedNote = await this.notesService.editNote(noteId, noteDto);
        return editedNote;
    }

    @Delete(':id')
    async deleteNote(@Res() res, @Param('id') noteId: string) {
        const note = await this.notesService.deleteNote(noteId);
        if (!note) {
            return res
                .status(HttpStatus.NOT_FOUND)
                .json({ status: 404, error: "Not found!" });
        }
        return res.status(HttpStatus.OK).json({
            status: 200,
            message: 'Successful!',
        });
    }

}
