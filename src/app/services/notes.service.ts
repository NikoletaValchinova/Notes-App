import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, Subject, Subscription } from 'rxjs';

import { Note } from '../models/note.model';
import { Tag } from '../models/tag.model';
import { MenuService } from './menu.service';
import { TagsService } from './tags.service';

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  private selectedNote: Note = null;
  private noteList: Note[] = [];
  private priorityNotes: Note[] = [];
  private nonePriorityNotes: Note[] = [];
  private noteSelected = new Subject<Note>();
  private notesChanged = new Subject<Note[]>();
  private filteredNotes: Note[] = [];
  private searchString: string = '';
  private fromDate: Date;
  private toDate: Date;
  private checkedTags: Tag[] = [];
  private type: string = "all";
  subscription: Subscription;

  constructor(private readonly menuService: MenuService, private httpClient: HttpClient, private readonly tagsService: TagsService) {
    this.menuService.getSearchString().subscribe(str => {
      this.searchString = str;
      this.setNoteList();
    });
    this.menuService.getFromDate().subscribe(fromDate => {
      this.fromDate = fromDate;
      this.setNoteList();
    });
    this.menuService.getToDate().subscribe(toDate => {
      this.toDate = toDate;
      this.setNoteList();
    });
    this.menuService.getCheckedTags().subscribe(tags => {
      this.checkedTags = tags;
      this.setNoteList();
    });
    this.menuService.getType().subscribe(type => {
      this.type = type;
      this.setNoteList();
    });
    this.menuService.resetFired().subscribe((reset : boolean) => {
      if(reset) {
        this.searchString = '';
        this.fromDate = undefined;
        this.toDate = undefined;
        this.checkedTags = [];
        this.setNoteList();
      }
    });

    this.tagsService.getAllTags().subscribe(tags => this.setNoteList());
  }

  loadNotes() {
    return this.httpClient.get<Note[]>("http://localhost:3000/notes/").subscribe((res: any[]) => {
      res.forEach((note: any) => {
          note.tags = this.tagsService.getTagsById(note.tags);
      });
      this.noteList = res.sort((note1, note2) => (new Date(note2.date).getTime() - new Date(note1.date).getTime()));
      this.noteList.forEach(note => {
        if(note.priority === "high") {
          this.priorityNotes = [...this.priorityNotes, note];
        }
        else {
          this.nonePriorityNotes = [...this.nonePriorityNotes, note];
        }
      });
      this.setNotesChanged([...this.priorityNotes, ...this.nonePriorityNotes]);
    });
  }

  setNoteList() {
    this.httpClient.get<Note[]>("http://localhost:3000/notes/").subscribe((res: any[]) => {
      this.priorityNotes = [];
      this.nonePriorityNotes = [];
      res.forEach((note: any) => {
          note.tags = this.tagsService.getTagsById(note.tags);
      });
      this.noteList = res.sort((note1, note2) => (new Date(note2.date).getTime() - new Date(note1.date).getTime()));;

      this.noteList.forEach(note => {
        if(note.priority === "high") {
          this.priorityNotes = [...this.priorityNotes, note];
        }
        else {
          this.nonePriorityNotes = [...this.nonePriorityNotes, note];
        }
      });
      this.nonePriorityNotes = this.nonePriorityNotes.filter(note => this.noteContainsFilters(note));

      this.setNotesChanged([...this.priorityNotes, ...this.nonePriorityNotes]);
    });

  }

  getNoteList(): Observable<Note[]> {
    return this.notesChanged.asObservable();
  }

  addNote(title: string, content: string, date: string ,checkedTags: Tag[], priority: string, type: string, gifId: string) {
    let note = new Note("", title, content, date, checkedTags, priority, type, gifId);
    this.httpClient.post("http://localhost:3000/notes/",
                          {"title": title, "content": content,"date": date, "tags": checkedTags, "priority": priority, "type": type, 'gifId': gifId})
      .subscribe((res: any) => {
        note._id = res._id;
        note.tags = this.tagsService.getTagsById(res.tags);

        this.noteList = [note, ...this.noteList];

        if(!this.noteContainsFilters(note)) {
          this.menuService.openConfirmation();
        }
        this.setNoteList();
      });
  }

  editNote(noteId: string, title: string, content: string, date: string ,checkedTags: Tag[], priority: string, type: string, gifId: string) {
    this.httpClient.put("http://localhost:3000/notes"+ `/${noteId}`,
                        {"title": title, "content": content,"date": date, "tags": checkedTags, "priority": priority, "type": type, "gifId": gifId})
                   .subscribe((res: any) => {
                      this.noteList = this.noteList.filter(note => note._id !== res._id);
                      let note = res;
                      note.tags = this.tagsService.getTagsById(res.tags);
                      this.noteList = [note, ...this.noteList];
                      if(!this.noteContainsFilters(note)) {
                        this.menuService.openConfirmation();
                      }
                      this.setNoteList();
                   });
  }

  removeNote(noteIdToRemove: string) {
    this.noteList = this.noteList.filter(note => note._id !== noteIdToRemove);
    this.filteredNotes = this.filteredNotes.filter(note => note._id !== noteIdToRemove);
    this.noteSelected.next(null);

    this.notesChanged.next(this.filteredNotes);
    this.httpClient.delete("http://localhost:3000/notes"+ `/${noteIdToRemove}`).subscribe(res => this.setNoteList());
  }

  noteContainsSearchInput(note: Note): boolean {
    if(this.searchString !== '') {
      const words: string[] = this.searchString.split(' ');
      return words.some(word => (note.title + ' ' + note.content).toLowerCase().includes(word));
    }
    return true;
  }

  noteContainsFilters(note: Note) {
    return this.noteContainsSearchInput(note)
        && this.noteInDateInterval(note)
        && this.noteContainsTags(note)
        && this.noteContainsType(note);
  }

  noteContainsType(note: Note) {
    const type = note.type;
    return this.type === 'all' || type === this.type;
  }

  noteInDateInterval(note: Note): boolean {
    const noteDateTime = new Date(note.date).getTime();
    const toDate = new Date(this.toDate);

    if(this.fromDate && this.fromDate.getTime() > noteDateTime) {
      return false;
    }
    if(this.toDate && toDate.setDate(this.toDate.getDate() + 1) < noteDateTime) {
      return false;
    }
    return true;
  }

  noteContainsTags(note: Note): boolean {
    if(this.checkedTags.length === 0) {
      return true;
    }
    if(this.checkedTags.some(tag => note.tags.some(noteTag => noteTag.name === tag.name))) {
      return true;
    }
    return false;
  }

  setSelectedNote(note: Note) {
    this.httpClient.get("http://localhost:3000/notes"+ `/${note._id}`).subscribe((res: any) => {
      this.selectedNote = res.data;
      this.selectedNote.tags = this.tagsService.getTagsById(res.data.tags);
      this.noteSelected.next(this.selectedNote);
    })
  }

  getSelectedNote(): Observable<Note> {
    return this.noteSelected.asObservable();
  }

  setNotesChanged(notes: Note[]) {
    this.filteredNotes = notes;
    this.notesChanged.next(notes);
  }
}
