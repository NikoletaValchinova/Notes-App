import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { NotesService } from '../../../services/notes.service';
import { ConfirmationDialog } from '../../confirmation-dialog/confirmation-dialog';
import { Note } from '../../../models/note.model';

@Component({
  selector: 'app-note-item',
  templateUrl: './note-item.component.html',
  styleUrls: ['./note-item.component.scss']
})
export class NoteItemComponent {
  @Input() note: Note;
  dialogRef: MatDialogRef<ConfirmationDialog>;
  @Input() confirmDialog: boolean = false;
  selected: boolean;
  content: any;

  constructor(private readonly notesService: NotesService, private readonly router: Router, private readonly dialog: MatDialog) {
    notesService.getSelectedNote().subscribe(note => {

      if (note._id === this.note._id) {
        this.selected = true;
      }
      else {
        this.selected = false;
      }
    });
  }

  getContent() {
    if(this.note.type === 'note') {
      return this.note.content;
    }
    else {

       this.content = JSON.parse(this.note.content);
      const count = this.content.length;
      const checked = this.content.filter(item => item.isChecked === true).length;
      return ` ${count} items in the list, ${checked} done` ;
    }
  }

  openConfirmationDialog() {
    this.dialogRef = this.dialog.open(ConfirmationDialog, {
      width: '500px',
      data: {
        note: this.note,
        message: "Are you sure you want to delete this note:",
        buttonText: {
          ok: 'Delete',
          cancel: 'Cancel'
        }
      }
    });

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onDeleteNote(this.note);
      }
      this.dialogRef = null;
    });
  }

  onDeleteNote(note: Note) {
    this.notesService.removeNote(note._id);
    this.router.navigate(['/create-note']);
  }

  getDate() {
    const date = new Date(this.note.date);
    const hours = (date.getHours() <= 9) ? "0" + date.getHours() : date.getHours();
    const minutes = (date.getMinutes() <= 9) ? "0" + date.getMinutes() : date.getMinutes();
    if (this.note.date.toLocaleString().split(',')[0] === (new Date()).toLocaleString('en-GB').split(',')[0]) {
      return `Today, ${hours}:${minutes}`;
    }
    else {
      return this.note.date.toLocaleString().split(',')[0];
    }
  }
}
