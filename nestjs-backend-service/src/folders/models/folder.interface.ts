import { Document } from "mongoose";
import { NoteInterface } from "src/notes/models/note.interface";

export interface FolderInterface extends Document {
    readonly _id: string;
    title: string;
    notes: NoteInterface[];
}