import { Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { of as observableOf, of, Subscription } from 'rxjs';
 
import { CreateNoteComponent } from './create-note.component';
import { NotesService } from '../../services/notes.service';
import { TagsService } from '../../services/tags.service';
import { Note } from '../../models/note.model';
import { Tag } from '../../models/tag.model';

@Injectable()
class MockNotesService {
  getSelectedNote = () => { 
    return observableOf(new Note("","title", "content", "date", [], "normal","note"));
  };
  setSelectedNote = () => {};
  editNote = () => {};
  addNote = (note: Note) => {};
  removeNote = (note: Note) => {};
}

@Injectable()
class MockTagsService {
  getCheckedTags = () => {
    return observableOf({});
  }
  getPriority = () => {
    return observableOf({});
  }
  openChooseTagDialog = (checkedTags: Tag[]) => {}
}

describe('CreateNoteComponent', () => {
  let fixture;
  let component;
  let notesService : MockNotesService;
  let dialogSpy: jasmine.Spy;
  let dialogRefSpyObj = jasmine.createSpyObj({ afterClosed : of({}), close: null });
  dialogRefSpyObj.componentInstance = { body: '' };

  const noteForm = <NgForm>{
    reset: () => null,
    resetForm: () => null,
    valid: true,
    value: {
      title: 'title',
      content: 'content',
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, MatDialogModule ],
      declarations: [
        CreateNoteComponent
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: NotesService, useClass: MockNotesService },
        { provide: TagsService, useClass: MockTagsService }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(CreateNoteComponent);
    component = fixture.debugElement.componentInstance;
  }); 

  beforeEach(() => {
    dialogSpy = spyOn(TestBed.inject(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should open confirm dialog', async () => {
    component.noteForm = noteForm;
    component.openConfirmationDialog();

    expect(dialogSpy).toHaveBeenCalled();
  });

  it('should run constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should load checkedTags from service', async () => {
    component.tagsService = fixture.debugElement.injector.get(TagsService);
    component.tagsService.getCheckedTags().subscribe(tags => expect(component.checkedTags).toEqual(tags));
  });

  it("should load the selectedNote from the service", () => {
    component.notesService = fixture.debugElement.injector.get(NotesService);
    
    fixture.detectChanges();
    component.notesService.getSelectedNote().subscribe(note => expect(component.editedNote).toEqual(note));
  });

  it('should call onCreateNote() method if there is no selected note', async () => {
    notesService = fixture.debugElement.injector.get(NotesService);
    component.notesService.getSelectedNote = () => observableOf(null);
    spyOn(component,'onCreateNote');
    
    component.ngOnInit();

    expect(component.onCreateNote).toHaveBeenCalled();
  });

  it('should run updateTags()', async () => {
    component.tagsService = fixture.debugElement.injector.get(TagsService);
    spyOn(component.tagsService,'openChooseTagDialog');
    fixture.detectChanges();
    component.updateTags();
    expect(component.tagsService.openChooseTagDialog).toHaveBeenCalled();
  });

  it('should call onCreateNote() after submiting', async () => {
    spyOn(component,'onCreateNote');

    component.onSubmit({
      value: {
        title: {},
        content: {}
      }
    });
    expect(component.onCreateNote).toHaveBeenCalled();
  });

  it('title and content inputs should be empty after submiting', async () => {
    spyOn(component,'onCreateNote');

    component.onSubmit({
      value: {
        title: "title",
        content: "content"
      }
    });

    let compiled = fixture.debugElement.nativeElement;
    fixture.detectChanges();

    expect(compiled.querySelector('#title').textContent).toEqual("");
    expect(compiled.querySelector('#content').textContent).toEqual("");
  });

  it('should call addNote() when submiting NOT in edit mode', async () => {
    component.notesService = fixture.debugElement.injector.get(NotesService);
    component.editMode = false;

    const title = "title";
    const content = "content";

    const tags = component.checkedTags;
    component.priority = "normal";

    spyOn(component,'onCreateNote');
    spyOn(component.notesService,'addNote');

    component.onSubmit({
      value: {
        title: title,
        content: content
      }
    });
    expect(component.notesService.addNote).toHaveBeenCalledWith(title, content, new Date().toLocaleString(), tags, "normal");
  });

  it('should call editNote() when submiting in edit mode', async () => {
    component.notesService = fixture.debugElement.injector.get(NotesService);
    component.editMode = true;
    component.priority = "normal";
    component.editedNote = {_id: "1", title: "title", content: "", date: "", tags: [], priority: ""};

    const title = "title";
    const content = "content";
    const tags = component.checkedTags;

    spyOn(component,'onCreateNote');
    spyOn(component.notesService,'editNote');

    component.onSubmit({
      value: {
        title: title,
        content: content
      }
    });
    expect(component.notesService.editNote).toHaveBeenCalledWith("1", title, content, new Date().toLocaleString(), tags, "normal");
  });

  it('getDate() should show date and time if note not from today ', async () => {
    component.editedNote = component.editedNote || {};
    component.editMode = true;
    component.editedNote.date = new Date("01/01/2021 11:11");
    component.getDate();

    expect(component.getDate()).toEqual('1/1/2021 11:11');
  });

  it('getDate() should display 0 before the number if it has only one digit', async () => {
    component.editedNote = component.editedNote || {};
    component.editMode = true;
    component.editedNote.date = new Date("01/01/2021 01:01");
    component.getDate();

    expect(component.getDate()).toEqual('1/1/2021 01:01');
  });

  it('should reset the form when click on createNote()', async () => {
    component.noteForm = noteForm;
    component.onCreateNote();

    let compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('#title').textContent).toEqual("");
    expect(compiled.querySelector('#content').textContent).toEqual("");
    expect(component.editMode).toBeFalse();
  });


  it('should run removeNote() if in edit mode', async () => {
    component.notesService = fixture.debugElement.injector.get(NotesService);
    component.editMode = true;
    component.editedNote = {_id: "1", title: "title", content: "", date: "", tags: [], priority: ""};

    spyOn(component,"onCreateNote");
    spyOn(component.notesService,"removeNote");
    component.noteForm = component.noteForm || {};

    component.onDelete();

    expect(component.notesService.removeNote).toHaveBeenCalledWith("1");
    expect(component.onCreateNote).toHaveBeenCalled();
  });

  it('should run removeNote() if NOT in edit mode', async () => {
    component.editMode = false;
   
    component.noteForm = noteForm;
    component.onDelete();
    
    let compiled = fixture.debugElement.nativeElement;
    fixture.detectChanges();

    expect(compiled.querySelector('#title').textContent).toEqual("");
    expect(compiled.querySelector('#content').textContent).toEqual("");
  });

  it('should run ngOnDestroy()', async () => {
    component.subscription = new Subscription();
    spyOn(component.subscription,'unsubscribe');
    component.ngOnDestroy();
    expect(component.subscription.unsubscribe).toHaveBeenCalledTimes(1);
  });

});