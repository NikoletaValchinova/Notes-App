import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";

import { Observable, Subject } from "rxjs";
import { AddFolderDialog } from "../components/add-folder-dialog/add-folder-dialog";

import { ConfirmationDialog } from "../components/confirmation-dialog/confirmation-dialog";
import { Folder } from "../models/folder.model";
import { Tag } from "../models/tag.model";

@Injectable({ 
    providedIn: 'root' 
})
export class MenuService {
    private dialogRef: MatDialogRef<ConfirmationDialog>;
    private reset = new Subject<boolean>();
    private fromDate = new Subject<Date>();
    private toDate = new Subject<Date>();
    private checkedTags = new Subject<Tag[]>();
    private searchString = new Subject<string>();
    private type = new Subject<string>();
    private folders: Folder[] = [];

    constructor(private readonly dialog: MatDialog, private readonly http: HttpClient) {}

    openConfirmation() {
      this.dialogRef = this.dialog.open(ConfirmationDialog, {
        width: '400px',
        data: {
          message: "Do you want to keep the filters?",
          messageText: "In this case the note won't be shown in the list.",
          note: null,
          buttonText: {
            ok: 'Yes',
            cancel: 'No'
          }
        }
       });
    
      this.dialogRef.afterClosed().subscribe(result => {
        if (!result) {
          this.reset.next(true);
        }
        this.dialogRef = null;
      });
    }

    openFolderDialog() {
      const dialogRef = this.dialog.open(AddFolderDialog,{
        width: '400px'
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if(result) {
         this.folders = [...this.folders, result];
         this.http.post('http://localhost:3000/folders', {'title': result, 'notes': []}).subscribe();
        }
      });
  
        this.dialogRef = null;
    }

    resetFired(): Observable<boolean> {
      return this.reset.asObservable();
    }
    
    setSearchString(searchString: string) {
      return this.searchString.next(searchString);
    }

    getSearchString(): Observable<string> {
      return this.searchString.asObservable();
    }
    
    setFromDate(fromDate: Date) {
      return this.fromDate.next(fromDate);
    }

    getFromDate(): Observable<Date> {
      return this.fromDate.asObservable();
    }

    setToDate(toDate: Date) {
      return this.toDate.next(toDate);
    }

    getToDate(): Observable<Date> {
      return this.toDate.asObservable();
    }

    setCheckedTags(checkedTags: Tag[]) {
      return this.checkedTags.next(checkedTags);
    }
    
    getCheckedTags(): Observable<Tag[]> {
      return this.checkedTags.asObservable();
    }

    setType(type: string) {
      return this.type.next(type);
    }

    getType(): Observable<string> {
      return this.type.asObservable();
    }

    getAllFolders(userId: string) {
      return this.http.get<Folder[]>('http://localhost:3000/users/loggedUser/folders').subscribe();
  }
}