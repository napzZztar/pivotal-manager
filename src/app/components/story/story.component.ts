import {Component, OnInit, Input} from '@angular/core';

const _ = require('lodash');
const clipboard = require('electron').remote.clipboard;

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss']
})
export class StoryComponent implements OnInit {
  @Input() story: any;
  statusMap = {
    unscheduled: 'ac_unit',
    unstarted: 'playlist_add_',
    delivered: 'done',
    finished: 'done',
    accepted: 'done_all',
    rejected: 'close',
    started: 'play_arrow'
  };

  typeMap = {
    feature: 'star_rate',
    bug: 'bug_report',
    chore: 'settings',
    release: 'outlined_flag'
  };

  numberMap = {
    1: 'looks_one',
    2: 'looks_two',
    3: 'looks_3',
    4: 'looks_4',
    5: 'looks_5'
  };

  constructor() {
  }

  ngOnInit() {
  }

  getShortForm(str: string) {
    return str.substr(0, 17) + (str.length >= 17 ? '..' : '');
  }

  copyText(textToCopy: string) {
    clipboard.writeText(textToCopy);
  }

  copyBranchName(story) {
    let branchName = '';
    console.log(story);

    switch (story.storyType) {
      case 'feature':
        branchName += 'feature/';
        break;
      case 'bug':
        branchName += 'bugfix/';
        break;
    }

    branchName += story.id + '-' + _.kebabCase(story.name);

    this.copyText(branchName);
  }

  getAbbvr(word: string) {
    let chars = word.match(/([A-Z])|( \w)/gm);

    return chars.join('').toUpperCase();
  }
}
