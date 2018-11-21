import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {MatChipInputEvent} from '@angular/material';
import {COMMA, ENTER} from '@angular/cdk/keycodes';

const _ = require('lodash');

@Component({
  selector: 'app-meeting-note-add-story-modal',
  templateUrl: './meeting-note-add-story-modal.component.html',
  styleUrls: ['./meeting-note-add-story-modal.component.scss']
})
export class MeetingNoteAddStoryModalComponent implements OnInit {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  public projectId: number;
  public stories: string[] = [];
  projects: any[] = [];

  constructor(public dialogRef: MatDialogRef<any>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.projects = data.projects;
  }

  ngOnInit() {
  }

  addStoryId(event: MatChipInputEvent) {
    const value = (event.value || '').trim();
    const input = event.input;

    if (/#?\d{9} *$/.test(value)) {
      const inputValue = value.match(/(\d{9}) *$/)[1];
      this.stories.push(inputValue);
      this.stories = _.uniq(this.stories);
    }

    if (input) {
      input.value = '';
    }
  }

  removeStoryId(storyId: string) {
    const index = this.stories.indexOf(storyId);

    if (index >= 0) {
      this.stories.splice(index, 1);
    }
  }
}
