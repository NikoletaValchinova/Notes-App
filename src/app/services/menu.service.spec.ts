import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { of } from 'rxjs';

import { MenuService } from './menu.service';

describe('MenuService', () => {
  let menuService;
  let dialogSpy: jasmine.Spy;
  let dialogRefSpyObj = jasmine.createSpyObj({ afterClosed : of({}), close: null });
  dialogRefSpyObj.componentInstance = { body: '' };

  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [MatDialogModule],
        providers: [MenuService]
    });
    menuService = TestBed.inject(MenuService);

  });
  beforeEach(() => {
    dialogSpy = spyOn(TestBed.inject(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
  });

  it('should open confirm dialog', async () => {
    menuService.openConfirmation([]);

    expect(dialogSpy).toHaveBeenCalled();
  });

  it('should run resetFired()', async () => {
    menuService.reset = menuService.reset || {};
    spyOn(menuService.reset,'asObservable');

    menuService.resetFired();
    expect(menuService.reset.asObservable).toHaveBeenCalled();
  });

  it('should run setSearchString()', async () => {
    menuService.searchString = menuService.searchString || {};
    spyOn(menuService.searchString,'next');

    menuService.setSearchString({});
    expect(menuService.searchString.next).toHaveBeenCalled();
  });

  it('should run getSearchString()', async () => {
    menuService.searchString = menuService.searchString || {};
    spyOn(menuService.searchString,'asObservable');

    menuService.getSearchString();
    expect(menuService.searchString.asObservable).toHaveBeenCalled();
  });

  it('should run setFromDate()', async () => {
    menuService.fromDate = menuService.fromDate || {};
    spyOn(menuService.fromDate,'next');

    menuService.setFromDate({});
    expect(menuService.fromDate.next).toHaveBeenCalled();
  });

  it('should run getFromDate()', async () => {
    menuService.fromDate = menuService.fromDate || {};
    spyOn(menuService.fromDate,'asObservable');

    menuService.getFromDate();
    expect(menuService.fromDate.asObservable).toHaveBeenCalled();
  });

  it('should run setToDate()', async () => {
    menuService.toDate = menuService.toDate || {};
    spyOn(menuService.toDate,'next');

    menuService.setToDate({});
    expect(menuService.toDate.next).toHaveBeenCalled();
  });

  it('should run getToDate()', async () => {
    menuService.toDate = menuService.toDate || {};
    spyOn(menuService.toDate,'asObservable');

    menuService.getToDate();
    expect(menuService.toDate.asObservable).toHaveBeenCalled();
  });

  it('should run setCheckedTags()', async () => {
    menuService.checkedTags = menuService.checkedTags || {};
    spyOn(menuService.checkedTags,'next');

    menuService.setCheckedTags({});
    expect(menuService.checkedTags.next).toHaveBeenCalled();
  });

  it('should run getCheckedTags()', async () => {
    menuService.checkedTags = menuService.checkedTags || {};
    spyOn(menuService.checkedTags,'asObservable');
    menuService.getCheckedTags();
    expect(menuService.checkedTags.asObservable).toHaveBeenCalled();
  });

});