import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

import { NoteInterface } from 'src/notes/models/note.interface';

export type FolderDocument = Folder & Document;

@Schema()
export class Folder {
  @Prop()
  id: string;

  @Prop()
  title: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Note' }] })
  notes: NoteInterface[];
}

export const FolderSchema = SchemaFactory.createForClass(Folder);