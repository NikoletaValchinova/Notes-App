import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

import { TagInterface } from 'src/tags/models/tag.interface';

export type NoteDocument = Note & Document;

@Schema()
export class Note {
  @Prop()
  id: string;

  @Prop()
  title: string;

  @Prop()
  content: string;

  @Prop()
  date: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }] })
  tags: TagInterface[];

  @Prop()
  priority: string;

  @Prop()
  type: string;

  @Prop()
  gifId: string;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
