
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';

import { Subscription } from 'rxjs';

import { MenuService } from '../../services/menu.service';
import { TagsService } from '../../services/tags.service';
import { Tag } from '../../models/tag.model';

import { HttpClient } from '@angular/common/http';
import {Folder} from "../../models/folder.model";
import {AuthenticationService} from "../../services/authentication.service";
import {User} from "../../models/user.model";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  user: User;
  searchString: string = '';
  fromDate: Date;
  toDate: Date;
  subscription: Subscription;
  tags: Tag[] = [];
  checkedTags: Tag[] = [];
  panelOpenState = false;
  @ViewChildren('checkboxes') private checkboxes: QueryList<any>;
  type: string = "all";
  folders: Folder[];

  constructor(private readonly menuService: MenuService,
              private readonly tagsService: TagsService,
              private readonly authService: AuthenticationService,
              private readonly http: HttpClient) {
    this.menuService.resetFired().subscribe((reset: boolean) => {
      if (reset) {
        this.resetFields();
      }
    });

    this.subscription = tagsService.getAllTags().subscribe(tags => {
      this.tags = tags;
      this.checkedTags = this.checkedTags.filter(tag => this.tags.includes(tag));
      this.searchByTags();
    });

    this.http.get<User>("http://localhost:3000/users/loggedUser/").subscribe(user =>
    {
      this.user = user;
      this.folders = [...this.user.folders];
    });
  }

  ngOnInit() {
    this.tagsService.loadTags();
  }

  searchByString(searchString: string) {
    this.searchString = searchString;
    this.menuService.setSearchString(searchString.trim().toLowerCase());
  }

  searchByDate() {
    this.menuService.setFromDate(this.fromDate);
    this.menuService.setToDate(this.toDate);
  }

  searchByTags() {
    this.menuService.setCheckedTags(this.checkedTags);
  }

  searchByType() {
    this.menuService.setType(this.type);
  }

  updateTags(event: MatCheckboxChange, clickedTag: Tag) {
    if (event.checked) {
      this.checkedTags = [...this.checkedTags, clickedTag];
    }
    else {
      this.checkedTags = this.checkedTags.filter(tag => tag !== clickedTag);
    }
    this.searchByTags();
  }

  ifChecked(tag: Tag) {
    return this.checkedTags.includes(tag);
  }

  resetFields() {
    this.searchString = '';
    this.fromDate = undefined;
    this.toDate = undefined;
    this.checkedTags = [];

    this.checkboxes.forEach(box => box.checked = false);

    this.searchByString(this.searchString);
    this.searchByDate();
    this.searchByTags();
  }

  createFolder() {
    this.menuService.openFolderDialog();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
