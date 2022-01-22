import { Folder } from "./folder.model";

export class User {
    _id: string;
    name: string;
    email: string;
    password: string;
    folders: Folder[];
}