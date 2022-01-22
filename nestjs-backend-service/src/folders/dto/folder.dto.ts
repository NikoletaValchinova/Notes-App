import { IsArray, IsNotEmpty, IsString, Length, ValidateNested } from 'class-validator';
import { NoteInterface } from 'src/notes/models/note.interface';

export class FolderDto {
    readonly title: string;

    @ValidateNested()
    @IsArray()
    readonly notes: NoteInterface[];
  }