import { Component, Inject } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

import { Tag } from '../../models/tag.model';

@Component({
  selector: 'choose-tag-dialog',
  templateUrl: 'choose-tag-dialog.html',
  styleUrls: ['./choose-tag-dialog.scss']
})
export class ChooseTagDialog {


  allTags: Tag[] = [];
  checkedTags: Tag[] = [];
  tagName: string;
  colors: string[] = ["purple", "#007bc0", "#0d335d", "rgb(61, 162, 165)", "#c1a1d3", "#1a508b", "purple", "rgb(121, 121, 196)",
    "hsl(207, 32%, 50%)", "#1a508b", "#29c6f0", "rgb(100, 45, 145)", "#48c9b0", "#CCCCFF", "#9966FF"];

  colorNum: number;
  priority: string;
  type: string;

  constructor(@Inject(MAT_DIALOG_DATA) private data:  any,
    private readonly dialogRef: MatDialogRef<ChooseTagDialog>,
    private readonly http: HttpClient) {
    if (data) {
      this.allTags = data.allTags;
      this.checkedTags = data.checkedTags;
      this.priority = data.priority;
      this.type = data.type;
    }
    this.colorNum = this.allTags.length;
  }

  ifChecked(tag: Tag) {
    return this.checkedTags.find(someTag => someTag.name === tag.name) ? true : false;
  }
  
  updateChecked(event: MatCheckboxChange, clickedTag: Tag) {
    if (event.checked) {
      this.checkedTags = [...this.checkedTags, clickedTag];
    }
    else {
      this.checkedTags = this.checkedTags.filter(tag => tag.name !== clickedTag.name);
    }
  }

  updatePriority(event: MatCheckboxChange) {
    if (event.checked) {
      this.priority = "high";
    }
    else {
      this.priority = "normal";
    }
  }

  addTag() {
    if (this.tagName.trim() !== '') {
      let newTag;

      if (!this.allTags.some(someTag => someTag.name === this.tagName)) {

        newTag = new Tag("", this.tagName, this.setTagColor());

        this.http.post("http://localhost:3000/tags/", { name: newTag.name, color: newTag.color }).subscribe((res: any) => {
          newTag._id = res._id;
          this.allTags = [...this.allTags, newTag];
          this.checkedTags = [...this.checkedTags, newTag];

          setTimeout(() => {
            var element = document.getElementById("tags");
            element.scrollTop = element.scrollHeight - element.clientHeight;
          }, 1);
        });
      }
      else if (!this.checkedTags.some(someTag => someTag.name === this.tagName)) {
        newTag = this.allTags.find(someTag => someTag.name === this.tagName);
        this.checkedTags = [...this.checkedTags, newTag];
      }

      this.tagName = '';
    }

  }

  onDeleteTag(tagIdToRemove: string) {
    this.allTags = this.allTags.filter(tag => tag._id !== tagIdToRemove);
    this.checkedTags = this.checkedTags.filter(tag => tag._id !== tagIdToRemove);
    this.http.delete("http://localhost:3000/tags" + `/${tagIdToRemove}`).subscribe();
  }

  setTagColor() {
    return this.colors[this.colorNum++ % this.colors.length];
  }

  onDone() {
    return [this.priority, this.type, [...this.checkedTags], [...this.allTags]];
  }

}