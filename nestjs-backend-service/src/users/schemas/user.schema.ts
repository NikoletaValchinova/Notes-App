import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

import { FolderInterface } from 'src/folders/models/folder.interface';
import { Folder } from 'src/folders/schemas/folder.schema';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Folder' }] })
  folders: FolderInterface[];
}

export const UserSchema = SchemaFactory.createForClass(User);