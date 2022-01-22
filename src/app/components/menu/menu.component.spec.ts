import { TestBed } from '@angular/core/testing';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { of as observableOf } from 'rxjs';

import { MenuComponent } from './menu.component';
import { MenuService } from '../../services/menu.service';
import { TagsService } from '../../services/tags.service';
import { Tag } from '../../models/tag.model';

@Injectable()
class MockMenuService {
  resetFired = function() {
    return observableOf({});
  };
  setSearchString= () => {};
  setFromDate = () => {};
  setToDate = () => {};
  setCheckedTags = () => {};
}

@Injectable()
class MockTagsService {
  getAllTags = function() {
    return observableOf({});
  };
  loadTags = () => {};
}

describe('MenuComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [
        MenuComponent
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: MenuService, useClass: MockMenuService },
        { provide: TagsService, useClass: MockTagsService }
      ]
    }).overrideComponent(MenuComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should create menu comp', async () => {
    expect(component).toBeTruthy();
  });

  it('should run ngOnInit()', async () => {
    component.tagsService = component.tagsService || {};
    spyOn(component.tagsService,"loadTags");
    
    component.ngOnInit();
    expect(component.tagsService.loadTags).toHaveBeenCalled();
  });

  it('should run searchByString()', async () => {
    component.menuService = component.menuService || {};
    spyOn(component.menuService,"setSearchString");

    component.searchByString('searchString');
    expect(component.menuService.setSearchString).toHaveBeenCalled();
  });

  it('should run searchByDate()', async () => {
    component.menuService = component.menuService || {};
    component.fromDate = 
    spyOn(component.menuService,"setFromDate");
    spyOn(component.menuService,"setToDate");
    
    component.searchByDate();
    expect(component.menuService.setFromDate).toHaveBeenCalled();
    expect(component.menuService.setToDate).toHaveBeenCalled();
  });

  it('should run searchByTags()', async () => {
    component.menuService = component.menuService || {};
    spyOn(component.menuService,"setCheckedTags");
    
    component.searchByTags();
    expect(component.menuService.setCheckedTags).toHaveBeenCalled();
  });

  it('updateTags() should add checked tags ', async () => {
    component.checkedTags = component.checkedTags || {};
    component.checkedTags = ['checkedTags'];
    spyOn(component,"searchByTags");

    component.updateTags({
      checked: {}
    }, {});
    expect(component.searchByTags).toHaveBeenCalled();
  });

  it('updateTags() should remove the unchecked tags', async () => {
    component.checkedTags = component.checkedTags || {};
    const tag = new Tag("","tag",'');
    component.checkedTags = [tag];
    spyOn(component,"searchByTags");

    component.updateTags({
      checked: false
    }, tag);
    expect(component.searchByTags.length).toEqual(0);
  });

  it('should run ifChecked()', async () => {
    component.checkedTags = component.checkedTags || {};
    spyOn(component.checkedTags,"includes");
    
    component.ifChecked({});
    expect(component.checkedTags.includes).toHaveBeenCalled();
  });

  it('should run resetFields()', async () => {
    component.checkboxes = component.checkboxes || {};
    component.checkboxes = [{checked: true}];
    component.resetFields();

    expect(component.checkboxes[0].checked).toEqual(false);
  });

  it('should run ngOnDestroy()', async () => {
    component.subscription = component.subscription || {};
    spyOn(component.subscription,"unsubscribe");
    component.ngOnDestroy();
    expect(component.subscription.unsubscribe).toHaveBeenCalled();
  });

});