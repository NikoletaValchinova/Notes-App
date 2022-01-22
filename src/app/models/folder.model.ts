import { Note } from "./note.model";

export class Folder {
  constructor(public _id: string, 
              public title: string, 
              public notes: Note[]
              ) {}
}
