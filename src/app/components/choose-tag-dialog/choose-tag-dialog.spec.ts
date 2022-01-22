import { TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ChooseTagDialog } from './choose-tag-dialog';
import { Tag } from '../../models/tag.model';

export class MtDialogRefMock {
    close(value = '') {
    }
}

describe('ChooseTagDialog', () => {
  let fixture;
  let component;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [ MatDialogModule, HttpClientTestingModule ],
        declarations: [
          ChooseTagDialog
        ],
        providers: [
            { provide: MatDialogRef, useClass: MtDialogRefMock }, 
            { provide: MAT_DIALOG_DATA, useValue: { allTags: [], checkedTags: [] } }
        ]
    }).compileComponents();
        
    fixture = TestBed.createComponent(ChooseTagDialog);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
 });


  it('should run constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('ifChecked() should return true if tag is in checkedTags', async () => {
    component.checkedTags = [{
        name: 'checkedTag',
        color: ''
     }];

    expect(component.ifChecked({
        name: 'checkedTag',
        color: ''
     })).toBeTrue();
  });

  it('ifChecked() should return true if tag is in checkedTags', async () => {
    component.checkedTags = [{
        name: 'checkedTag',
        color: ''
     }];

    expect(component.ifChecked({
        name: 'uncheckedTag',
        color: ''
     })).toBeFalse();
  });

  it('should remove the unchecked tag when run updateChecked()', async () => {
    component.checkedTags = [{
        name: 'tagName',
        color: ''
      }];
    component.updateChecked( { source: null, checked: false }, {
      name: 'tagName',
      color: ''
    });
    expect(component.checkedTags.length).toEqual(0);
  });

  it('should add the checked tag when run updateChecked()', async () => {
    component.checkedTags = [];
    component.updateChecked( { source: null, checked: true }, {
      name: 'tagName',
      color: ''
    });
    expect(component.checkedTags.length).toEqual(1);
  });

  it('should check tag if it does exist but it is not checked', async () => {
    component.tagName ='tagName';
    component.allTags = [{name: 'tagName',color: ''}];
    component.checkedTags = [];

    component.addTag();
    fixture.detectChanges();
    
    expect(component.allTags.length).toEqual(1);
    expect(component.checkedTags.length).toEqual(1);
  });

  it('addTag() should NOT add tag if it already exists', async() => {
    component.tagName = 'tagName';
    let tag = new Tag("", 'tagName', '');
    component.allTags.push(tag);
    component.checkedTags = [];

    component.addTag();

    expect(component.allTags.length).toEqual(1);
    expect(component.checkedTags.length).toEqual(1);
  });

  it('should run setTagColor()', async () => {
    spyOn(component,'setTagColor');
    component.setTagColor();
    expect(component.setTagColor).toHaveBeenCalled();
  });

  it('should run setTagColor()', async () => {
    component.colors = [1,2];
    component.colorNum = 3;
    expect(component.setTagColor()).toEqual(2);
  });

  it('should run onDone()', async () => {
    spyOn(component,'onDone');
    component.onDone();
    expect(component.onDone).toHaveBeenCalled();
  });

});