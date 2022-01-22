import { Document } from "mongoose";
import { TagInterface } from "src/tags/models/tag.interface";


export interface NoteInterface extends Document {
    readonly id: string;
    title: string;
    content: string;
    date: string;
    tags: TagInterface[];
    priority: string;
    type: string;
    gifId: string;
}
