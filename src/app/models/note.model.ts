import { Tag } from "./tag.model";

export class Note {
  constructor(public _id: string,
              public title: string,
              public content: string,
              public date: string,
              public tags: Tag[],
              public priority: string,
              public type: string,
              public gifId: string) { }
}
