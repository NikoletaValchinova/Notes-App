import { Component, Inject } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

import { Folder } from '../../models/folder.model';


@Component({
  selector: 'add-folder-dialog',
  templateUrl: 'add-folder-dialog.html',
  styleUrls: ['./add-folder-dialog.scss']
})
export class AddFolderDialog {

     folderName: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data:  any,
    private readonly dialogRef: MatDialogRef<AddFolderDialog>,
    private readonly http: HttpClient
  ) { }

  addFolder() {
      let newFolder = new Folder('',this.folderName, []);
  }

  onDone() {
    return this.folderName;
  }

}
