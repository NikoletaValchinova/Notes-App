import { TestBed } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { of as observableOf } from 'rxjs';

import { NotesService } from './notes.service';
import { MenuService } from './menu.service';
import { Note } from '../models/note.model';
import { TagsService } from './tags.service';

@Injectable()
class MockMenuService {
  getSearchString = function() {
    return observableOf({});
  };
  getFromDate = function() {
    return observableOf({});
  };
  getToDate = function() {
    return observableOf({});
  };
  getCheckedTags = function() {
    return observableOf({});
  };
  resetFired = function() {
    return observableOf('');
  };
  openConfirmation = () => {
  }
}

@Injectable()
class MockTagsService {
  getAllTags = function() {
    return observableOf({});
  };
  loadTags = () => {};
}

describe('NotesService', () => {
  let notesService;
  let menuServiceSpy;
  let tagsServiceSpy;
  let http;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
        providers: [
            NotesService,
            { provide: MenuService, useClass: MockMenuService },
            { provide: TagsService, useClass: MockTagsService }
        ]
  });

  notesService = TestBed.inject(NotesService);
  menuServiceSpy = TestBed.inject(MenuService) as jasmine.SpyObj<MenuService>;
  tagsServiceSpy = TestBed.inject(TagsService) as jasmine.SpyObj<TagsService>;
  http = TestBed.inject(HttpTestingController);
});


  it('should run getNoteList()', async () => {
    notesService.notesChanged = notesService.notesChanged || {};
    spyOn(notesService.notesChanged,'asObservable');
    notesService.getNoteList();
    expect(notesService.notesChanged.asObservable).toHaveBeenCalled();
  });

  it('should run getSelectedNote()', async () => {
    notesService.noteSelected = notesService.noteSelected || {};
    spyOn(notesService.noteSelected,'asObservable');
    notesService.getSelectedNote();
    expect(notesService.noteSelected.asObservable).toHaveBeenCalled();
  });

  it('should run setNotesChanged()', async () => {
    notesService.notesChanged = notesService.notesChanged || {};
    spyOn(notesService.notesChanged,'next');
    notesService.setNotesChanged({});
    expect(notesService.notesChanged.next).toHaveBeenCalled();
  });

  it('noteContainsTags() should return true if note contains tags', async () => {
    notesService.checkedTags = [];

    expect(notesService.noteContainsTags({})).toBeTrue();
  });

  it('noteContainsTags() should return false if note does NOT contain tags', async () => {
    notesService.checkedTags = [{name:'tag', color:''}];

    expect(notesService.noteContainsTags({name: 'title', tags:[{name:'tag', color:''}]})).toBeTrue();
  });

  it('noteContainsTags() should return false if note does NOT contain tags', async () => {
    notesService.checkedTags = [{name:'tag', color:''}];

    expect(notesService.noteContainsTags({name: 'title', tags:[{name:'anotherTag', color:''}]})).toBeFalse();
  });

  it('noteContainsFilters() should return true if note conatins filters', async () => {
    notesService.searchString = 'title';
    notesService.fromDate = '';
    notesService.toDate = '';
    notesService.noteContainsTags = () => true;

    expect(notesService.noteContainsFilters({title: 'title', content: '', date: '' ,tags:[{name:'anotherTag', color:''}]})).toEqual(true);
  });

  it('noteContainsSearchInput() should return true if note conatins searchString', async () => {
    notesService.searchString = '';

    expect(notesService.noteContainsSearchInput({title: 'title', content: '', date: '05.01.2020' ,tags:[{name:'anotherTag', color:''}]})).toEqual(true);
  });

  it('noteInDateInterval() should return false if note date after date interval', async () => {
    notesService.fromDate = new Date('06/01/2019');
    notesService.toDate = new Date('08/01/2019');

    expect(notesService.noteInDateInterval(new Note("1",'title', '', new Date('03/01/2020').toLocaleString(), [], 'normal', ''))).toEqual(false);
  });

  it('noteInDateInterval() should return false if note date before date interval', async () => {
    notesService.fromDate = new Date('06/01/2020');
    notesService.toDate = new Date('08/01/2020');

    expect(notesService.noteInDateInterval(new Note("2",'title', '', new Date('03/01/2020').toLocaleString(), [], 'normal', ''))).toEqual(false);
  });
});
