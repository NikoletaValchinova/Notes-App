import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { Observable, Subject } from 'rxjs';

import { ChooseTagDialog } from '../components/choose-tag-dialog/choose-tag-dialog';
import { Tag } from '../models/tag.model';

@Injectable({ 
  providedIn: 'root' 
})
export class TagsService {

    private allTags: Tag[] = [];
    dialogRef: MatDialogRef<ChooseTagDialog>;
    private tagsChanged = new Subject<Tag[]>();
    private allTagsChanged = new Subject<Tag[]>();
    private priorityChanged = new Subject<string>();
    private typeChanged = new Subject<string>();

    constructor(private readonly dialog: MatDialog, private httpClient: HttpClient) {
    }

    loadTags() {
      return this.httpClient.get<Tag[]>("http://localhost:3000/tags/").subscribe((res: Tag[]) => this.allTags = res );
    }

    getTagsById(tagIds: String[]): Tag[] {
      let tags: Tag[] = [];
      tagIds.forEach(tagId => {
        const tag = this.allTags.find(tag => tag._id == tagId);
        if (tag) {
          tags = [...tags, tag];
        }
      });
     
      return tags;
    }

    getAllTags(): Observable<Tag[]> {
      this.httpClient.get<Tag[]>("http://localhost:3000/tags/",).subscribe((res: Tag[]) => this.allTagsChanged.next(res) );
      return this.allTagsChanged.asObservable();
    }
    
    setAllTagsChanged(tags: Tag[]) {
      this.allTags = tags;
      return this.allTagsChanged.next(tags);
    }

    getCheckedTags(): Observable<Tag[]> {
      return this.tagsChanged.asObservable();
    }
    
    setCheckedTagsChanged(tags: Tag[]) {
      return this.tagsChanged.next(tags);
    }

    setPriority(priority: string) {
      this.priorityChanged.next(priority);
    }

    getPriority(): Observable<string> {
      return this.priorityChanged.asObservable();
    }

    setNoteType(type: string) {
      return this.typeChanged.next(type);
    }

    getNoteType(): Observable<string> {
      return this.typeChanged.asObservable();
    }

    openChooseTagDialog(checkedTags: Tag[], priority: string, type: string) {
        const dialogRef = this.dialog.open(ChooseTagDialog,{
          width: '400px',
          data: {
            allTags: this.allTags,
            checkedTags: checkedTags,
            priority: priority,
            type: type
          }
        });
    
        dialogRef.afterClosed().subscribe(result => {
          if(result) {
            this.setPriority(result[0]);
            this.setNoteType(result[1]);
            this.setCheckedTagsChanged(result[2]);
            this.setAllTagsChanged(result[3]);
          }
          this.dialogRef = null;
        });
      }

}