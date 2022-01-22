import { Document } from "mongoose";
import { FolderInterface } from "src/folders/models/folder.interface";

export interface UserInterface extends Document {
    readonly id: string;
    name: string;
    email: string;
    password: string;
    folders: FolderInterface[];
}