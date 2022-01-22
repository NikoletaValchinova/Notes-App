import { TestBed } from '@angular/core/testing';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { of as observableOf, Subscription } from 'rxjs';


import { NoteListComponent } from './note-list.component';
import { NotesService } from '../../services/notes.service';

let notes = [
  {
    "title": "New note",
    "content": "",
    "date": "05/10/2020",
    "tags": 
    [
      {
        "name": "happy",
        "color": "purple"
      },
      {
        "name": "sad",
        "color": "lightblue"
      }
    ]
  },
  {
    "title": "My first note",
    "content": "That is my first note nad it has some content",
    "date": "05/10/2020",
    "tags": []
  },
  {
    "title": "Products",
    "content": "",
    "date": "05/10/2020",
    "tags": []
  },
  {
    "title": "Reminders",
    "content": "",
    "date": "05/10/2020",
    "tags": []
  }
]



@Injectable()
class MockNotesService {
  getNoteList = () => {
    return observableOf([...notes]);
  };

  loadNotes = () => {
  };

  setSelectedNote = () => {};
}

describe('NoteListComponent', () => {
  let fixture;
  let component;
  let service : MockNotesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        NoteListComponent
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: NotesService, useClass: MockNotesService }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(NoteListComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should show notes list', async () => {
    service = fixture.debugElement.injector.get(NotesService);
    expect(component.notes.length).toEqual(4);
  });

  it("should use the noteList from the service", () => {
    service = fixture.debugElement.injector.get(NotesService);
    fixture.detectChanges();
    service.getNoteList().subscribe(notes => expect(component.notes).toEqual(notes));
  });
  
  it('should show message that note list is empty', async () => {
    component.notes.length = 0;
    let compiled = fixture.debugElement.nativeElement;
    fixture.detectChanges();

    expect(compiled.querySelector('p').textContent).toEqual("There are no notes to show in the list.");
  });

  it('should not show message that note list is empty', async () => {
    component.notes.length = 1;
    let compiled = fixture.debugElement.nativeElement;
    fixture.detectChanges();
    expect(compiled.querySelector('p')).toBeNull();
  });

  it('should run onEditNote()', async () => {
    component.service = fixture.debugElement.injector.get(NotesService);
    spyOn(component.service, 'setSelectedNote');
    component.onEditNote({});
    expect(component.service.setSelectedNote).toHaveBeenCalled();
  });

  it('should run ngOnDestroy()', async () => {
    component.subscription = new Subscription();
    spyOn(component.subscription,'unsubscribe');
    component.ngOnDestroy();
    expect(component.subscription.unsubscribe).toHaveBeenCalledTimes(1);
  });

});