import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ConfirmationDialog } from './confirmation-dialog';
import { Note } from '../../models/note.model';


export class MatDialogRefMock {
    close(value = '') {
    }
}

describe('ConfirmationDialog', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, MatDialogModule ],
      declarations: [
        ConfirmationDialog
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: MatDialogRef, useClass: MatDialogRefMock }, 
        { provide: MAT_DIALOG_DATA, useValue: {message: "Are you sure?",
              note: {},
              buttonText: {
                ok: 'Delete',
                cancel: 'Cancel'
              }} } ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmationDialog);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });
  
  it('should not load note item when data is NOT given', async () => {
    component.data = null;
    let compiled = fixture.debugElement.nativeElement;
    fixture.detectChanges();

    expect(compiled.querySelector("h2").textContent).toEqual("Are you sure?");
    expect(compiled.querySelector("p")).toBeNull();
  })

  it('should have delete and cancel buttons', async () => {
    component.data = ["","",{}];
    component.data.buttonText = "ok";
    fixture.detectChanges();

    expect(component.confirmButtonText).toEqual("Delete");
    expect(component.cancelButtonText).toEqual("Cancel");
  })

  it('should not load note item when note is NOT given', async () => {
    component.note = null;
    let compiled = fixture.debugElement.nativeElement;
    fixture.detectChanges();

    expect(compiled.querySelector('app-note-item')).toBeNull();
  })

  it('should load note item when note is given', async () => {
    component.note = new Note("", "title", "content", "date", [], "normal");
    let compiled = fixture.debugElement.nativeElement;
    fixture.detectChanges();
    expect(compiled.querySelector('app-note-item').note).toEqual(component.note);
  })

  it('should load "Are you sure?" message when data is NOT given', async () => {
    component.data = null;
    let compiled = fixture.debugElement.nativeElement;
    
    fixture.detectChanges();

    expect(compiled.querySelector("h2").textContent).toEqual("Are you sure?");
    expect(compiled.querySelector("p")).toBeNull();
  })

  it('should load buttons text', async () => {
    component.data.buttonText = true;
    expect(component.confirmButtonText).toEqual("Delete");
    expect(component.cancelButtonText).toEqual("Cancel");
  })

  it('should run onConfirmClick()', async () => {
    component.dialogRef = fixture.debugElement.injector.get(MatDialogRef);

    spyOn(component.dialogRef, 'close');
    component.onConfirmClick();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });

});