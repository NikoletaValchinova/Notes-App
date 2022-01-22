import { Component, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { Note } from '../../models/note.model';
import { NotesService } from '../../services/notes.service';

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.scss']
})
export class NoteListComponent implements OnInit {
    notes: Note[] = [];
    subscription: Subscription;

    constructor(private readonly notesService: NotesService) {
      this.subscription = this.notesService.getNoteList().subscribe((notes: Note[]) => this.notes = notes );
    }

    ngOnInit() {
      this.notesService.loadNotes();
    }

    onEditNote(note: Note) {
      this.notesService.setSelectedNote(note);
    }

    ngOnDestroy() {
      this.subscription.unsubscribe();
    }
   
}
