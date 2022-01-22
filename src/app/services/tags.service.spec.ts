import { TestBed } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { of } from 'rxjs';

import { TagsService } from './tags.service';

@Injectable()
class MockHttpClient {
  post() {};
  get() {};
}

describe('TagsService', () => {
  let tagsService;
  let dialogSpy: jasmine.Spy;
  let dialogRefSpyObj = jasmine.createSpyObj({ afterClosed : of({}), close: null });
  dialogRefSpyObj.componentInstance = { body: '' };

  beforeEach(() => {
    TestBed.configureTestingModule({ 
        imports: [MatDialogModule],
        providers: [  
            TagsService, 
            { provide: HttpClient, useClass: MockHttpClient }
        ]
    });
    tagsService = TestBed.inject(TagsService);
  });

  beforeEach(() => {
    dialogSpy = spyOn(TestBed.inject(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
  });

  it('should open confirm dialog', async () => {
    tagsService.openChooseTagDialog([]);

    expect(dialogSpy).toHaveBeenCalled();
  });

  it('should run setAllTagsChanged()', async () => {
    tagsService.allTagsChanged = tagsService.allTagsChanged || {};
    spyOn(tagsService.allTagsChanged,'next');
    
    tagsService.setAllTagsChanged({});
    expect(tagsService.allTagsChanged.next).toHaveBeenCalled();
  });

  it('should run getCheckedTags()', async () => {
    tagsService.tagsChanged = tagsService.tagsChanged || {};
    spyOn(tagsService.tagsChanged,'asObservable');

    tagsService.getCheckedTags();
    expect(tagsService.tagsChanged.asObservable).toHaveBeenCalled();
  });

  it('should run setCheckedTagsChanged()', async () => {
    tagsService.tagsChanged = tagsService.tagsChanged || {};
    spyOn(tagsService.tagsChanged,'next');
    
    tagsService.setCheckedTagsChanged({});
    expect(tagsService.tagsChanged.next).toHaveBeenCalled();
  });

});