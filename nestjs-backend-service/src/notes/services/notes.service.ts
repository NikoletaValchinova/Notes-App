import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { NoteDto } from '../dto/note.dto';
import { NoteInterface } from '../models/note.interface';

@Injectable()
export class NotesService {
    constructor(@InjectModel('Note') private readonly noteModel: Model<NoteInterface>) {}

    async addNote(noteDto: NoteDto): Promise<NoteInterface> {
        const newNote = new this.noteModel(noteDto);
        const result = await newNote.save();
        return result;
    }

    async getAllNotes(): Promise<NoteInterface[]> {
        return this.noteModel.find().exec();
    }

    async editNote(noteId: string, noteDto: NoteDto) {
        const note = await this.noteModel.findById(noteId).exec();

        if (!note) {
          throw new NotFoundException('Could not find note.');
        }

        note.title = noteDto.title;
        note.content = noteDto.content;
        note.date = noteDto.date;
        note.tags = [...noteDto.tags];
        note.priority = noteDto.priority;
        note.type = noteDto.type;
        note.gifId = noteDto.gifId;

        await note.save();
        return this.noteModel.findById(noteId).exec();
    }

    async getSelectedNote(noteId: string): Promise<NoteInterface> {
        const note = await this.noteModel.findById(noteId).exec();
        return note;
    }

    async deleteNote(noteId: string): Promise<NoteInterface> {
        const note = await this.noteModel.findByIdAndDelete(noteId).exec();
        return note;
    }
}
