import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatCheckboxChange } from '@angular/material/checkbox';

import {Subject, Subscription} from 'rxjs';

import { ConfirmationDialog } from '../confirmation-dialog/confirmation-dialog';
import { Note } from '../../models/note.model';
import { NotesService } from '../../services/notes.service';
import { TagsService } from '../../services/tags.service';
import { Tag } from '../../models/tag.model';
import {GifsService} from "../../services/gifs.service";
import {take, takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-create-note',
  templateUrl: './create-note.component.html',
  styleUrls: ['./create-note.component.scss']
})
export class CreateNoteComponent implements OnInit {

  noteForm: FormGroup = new FormGroup({
    title: new FormControl(),
    content: new FormControl()
  });
  dialogRef: MatDialogRef<ConfirmationDialog>;
  subscription: Subscription;

  editedNote: Note;
  editMode: boolean;

  checkboxes: any[] = [];
  checkedTags: Tag[] = [];

  priority: string;
  type: string;

  notifier = new Subject();
  selectedGif: any;

  constructor(private readonly fb: FormBuilder, private readonly notesService: NotesService,
              private readonly tagsService: TagsService, private readonly dialog: MatDialog,
              private gifsService: GifsService) {
    this.editMode = false;
    this.priority = "normal";
    this.type = "note";
    this.checkedTags = [];
    this.checkboxes = [];
    this.setForm("", "");
    this.editedNote = new Note("", "", "", "", [], "", "", "");

    this.subscription = this.tagsService.getCheckedTags().subscribe(newTags => this.checkedTags = newTags);
    this.subscription = this.tagsService.getPriority().subscribe(priority => this.priority = priority);
    this.subscription = this.tagsService.getNoteType().subscribe(type => {
      if (this.type !== type) {
        this.type = type;

        if (this.type === 'note') {
          this.checkboxes = JSON.parse(this.editedNote.content);
          const content = this.checkboxes.reduce(((text, checkbox) => text += checkbox.label + '\n'), '');
          this.setForm(this.noteForm.value.title, content);

          this.editedNote.content = content;
        }
        else {
          this.checkboxes = [];
          this.noteForm.value.content.split("\n").forEach(line => {
            if (line) { this.checkboxes = [...this.checkboxes, { label: line, isChecked: false }] }
          });
          this.editedNote.content = JSON.stringify(this.checkboxes);
          this.setForm(this.noteForm.value.title, "");
        }
      }
    });

    this.notesService.getSelectedNote().subscribe((selectedNote: Note) => {
      if (selectedNote) {
        this.editMode = true;
        this.editedNote = selectedNote;
        this.checkboxes = [];
        this.checkedTags = this.editedNote.tags;
        this.priority = this.editedNote.priority;
        this.type = this.editedNote.type;

        if (this.editedNote.gifId) {
          this.gifsService.getGifById(this.editedNote.gifId).subscribe(gif => {
            this.selectedGif = gif.data[0];
          });
        } else {
          this.selectedGif = null;
        }

        if (this.type === 'note') {
          this.setForm(this.editedNote.title, this.editedNote.content);
        }
        else {
          this.checkboxes = JSON.parse(this.editedNote.content);
          this.setForm(this.editedNote.title, "");
        }
      }
      else {
        this.onCreateNote();
      }
    });
  }

  ngOnInit() {
    this.gifsService.getSelectedGif().pipe(takeUntil(this.notifier)).subscribe(selectedGif => {
      this.selectedGif = selectedGif;
    });
  }

  updateTags() {
    this.tagsService.openChooseTagDialog(this.checkedTags, this.priority, this.type);
  }

  openConfirmationDialog() {
    if ((this.noteForm.value.title !== null || this.noteForm.value.content !== null) &&
      (this.noteForm.value.title !== '' || this.noteForm.value.content !== '')) {
      this.dialogRef = this.dialog.open(ConfirmationDialog, {
        width: '500px',
        data: {
          message: "Are you sure you want to delete this note:",
          note: {
            title: this.noteForm.value.title,
            content: this.noteForm.value.content,
            date: new Date().toLocaleString('en-GB'),
            tags: this.checkedTags,
            priority: this.priority,
            type: this.type
          },
          buttonText: {
            ok: 'Delete',
            cancel: 'Cancel'
          }
        }
      });

      this.dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.onDelete();
        }
        this.dialogRef = null;
      });
    }
  }

  setForm(title: string, content: string) {
    this.noteForm = this.fb.group({ 'title': title, 'content': content });
  }

  onSubmit(form: FormGroup) {
    const value = form.value;
    let content: string;
    content = this.type === "note" ? value.content : JSON.stringify(this.checkboxes);

    if (this.editMode) {
      this.notesService.editNote(this.editedNote._id, value.title, content, new Date().toLocaleString('en-US'), this.checkedTags, this.priority, this.type, this.selectedGif ? this.selectedGif.id : null);
    }
    else {
      this.notesService.addNote(value.title, content, new Date().toLocaleString('en-US'), this.checkedTags, this.priority, this.type, this.selectedGif ? this.selectedGif.id : null);
    }
    this.onCreateNote();
  }

  updateCheckboxes(event: MatCheckboxChange, clicked: string) {
    const index = this.checkboxes.findIndex(checkbox => checkbox['label'] === clicked['label']);
    this.checkboxes[index]["isChecked"] = event.checked;
  }

  onCreateNote() {
    this.checkedTags = [];
    this.editMode = false;
    this.priority = "normal";
    this.type = "note";
    this.checkboxes = [];
    this.editedNote = new Note("", "", "", "", [], "", "", "");
    this.selectedGif = null;
    this.setForm("", "");
  }

  getDate() {
    const date = new Date(this.editedNote.date);
    const hours = (date.getHours() <= 9) ? "0" + date.getHours() : date.getHours();
    const minutes = (date.getMinutes() <= 9) ? "0" + date.getMinutes() : date.getMinutes();
    return `${date.toLocaleDateString('en-GB')} ${hours}:${minutes}`;
  }

  onDelete() {
    if (this.editMode) {
      this.notesService.removeNote(this.editedNote._id);
    }
    this.onCreateNote();
  }

  addCheckbox() {
    this.checkboxes = [...this.checkboxes, { label: this.noteForm.value.content, isChecked: false }];
    this.editedNote.content = JSON.stringify(this.checkboxes);
    this.noteForm.get('content').setValue("");

  }

  removeCheckbox(checkbox: Object) {
    this.checkboxes = this.checkboxes.filter(item => item !== checkbox);
    this.editedNote.content = JSON.stringify(this.checkboxes);
  }

  onDeleteGif() {
    this.selectedGif = null;
    this.notesService.editNote(this.editedNote._id, this.editedNote.title,
      this.editedNote.content, new Date().toLocaleString('en-US'),
      this.checkedTags, this.priority, this.type, null);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.notifier.next();
    this.notifier.complete();
  }
}
