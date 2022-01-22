import { IsArray, IsNotEmpty, IsString, Length, ValidateNested } from 'class-validator';

import { TagInterface } from "src/tags/models/tag.interface";

export class NoteDto {
    readonly title: string;

    readonly content: string;

    @IsString()
    @Length(20, 22, {message: 'Date should contains 21 or 22 symbols'})
    @IsNotEmpty()
    readonly date: string;

    @ValidateNested()
    @IsArray()
    readonly tags: TagInterface[];

    readonly priority: string;

    readonly type: string;

    readonly gifId: string;
  }
