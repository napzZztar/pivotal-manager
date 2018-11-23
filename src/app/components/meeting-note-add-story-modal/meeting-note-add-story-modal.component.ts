import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {MatChipInputEvent} from '@angular/material';
import {COMMA, ENTER} from '@angular/cdk/keycodes';

import {PivotalService} from '../../services/pivotal.service';

const _ = require('lodash');

@Component({
  selector: 'app-meeting-note-add-story-modal',
  templateUrl: './meeting-note-add-story-modal.component.html',
  styleUrls: ['./meeting-note-add-story-modal.component.scss']
})
export class MeetingNoteAddStoryModalComponent implements OnInit {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  public storyIds: string[] = [];
  public stories: any[] = [];
  projects: any[] = [];

  constructor(private pivotal: PivotalService,
              private dialog: MatDialogRef<any>,
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
      const lastStoryLength = this.storyIds.length;
      this.storyIds.push(inputValue);
      this.storyIds = _.uniq(this.storyIds);

      if (lastStoryLength + 1 === this.storyIds.length) {
        this.stories[lastStoryLength] = {status: 'processing'};

        this.pivotal
          .getStory(inputValue)
          .then(story => {
            story.badge = '*';
            this.stories[lastStoryLength] = story;
          })
          .catch((error) => {
            console.log(error);
            this.stories[lastStoryLength] = {status: 'error'};
          });
      }
    }

    if (input) {
      input.value = '';
    }
  }

  removeStoryId(storyId: string) {
    const index = this.storyIds.indexOf(storyId);

    if (index >= 0) {
      this.storyIds.splice(index, 1);
      this.stories.splice(index, 1);
    }
  }

  getAbbvr(word: string) {
    const chars = word.match(/([A-Z])|( \w)/gm);

    return chars.join('').toUpperCase().replace(/ /gm, '');
  }
}
