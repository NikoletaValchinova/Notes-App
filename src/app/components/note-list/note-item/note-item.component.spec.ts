import { TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { of as observableOf } from 'rxjs';

import { NoteItemComponent } from './note-item.component';
import { NotesService } from 'src/app/services/notes.service';
import { CreateNoteComponent } from 'src/app/components/create-note/create-note.component';

describe('NoteItemComponent', () => {
  let fixture;
  let component;
  let notesService: NotesService;

  let dialogSpy: jasmine.Spy;
  let dialogRefSpyObj = jasmine.createSpyObj({ afterClosed : observableOf({}), close: null });
  dialogRefSpyObj.componentInstance = { body: '' };
  let getSelectdNoteSpy;
  let removeNoteSpy;

  beforeEach(() => {
    
    TestBed.configureTestingModule({
        imports: [ HttpClientTestingModule, RouterTestingModule.withRoutes([
          { path: 'create-note', component: CreateNoteComponent}
        ]), 
        MatDialogModule
      ],
      declarations: [
        NoteItemComponent
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [ NotesService ]
    }).compileComponents();
    
    fixture = TestBed.createComponent(NoteItemComponent);
    component = fixture.debugElement.componentInstance;
    notesService = fixture.debugElement.injector.get(NotesService);

    getSelectdNoteSpy = spyOn(notesService, 'getSelectedNote');
    removeNoteSpy =  spyOn(notesService, 'removeNote');
  });

  beforeEach(() => {
    dialogSpy = spyOn(TestBed.inject(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
  });

  it('should create note item comp', async () => {
    expect(component).toBeTruthy();
  });

  it('should open confirm dialog', async () => {
    component.note = component.note || {};
      component.openConfirmationDialog();

      expect(dialogSpy).toHaveBeenCalled();
  });

  it('getDate() should display the note date and time', async () => {
    component.note = component.note || {};
    component.note.date = new Date("01/01/2021 11:11");
    component.getDate();

    expect(component.getDate()).toEqual('1/1/2021');
  });

  it('getDate() should display Today if the note is from today', async () => {
    component.note = component.note || {};
    component.note.date = new Date();
    component.getDate();

    expect(component.getDate()).toContain('Today');
  });

  it('should run getDate()', async () => {
    component.note = component.editedNote || {};
    component.note.date = new Date();
    component.note.date.setHours(1);
    component.note.date.setMinutes(1);
    component.getDate();

    expect(component.getDate()).toEqual('Today, 01:01');
  });

});

