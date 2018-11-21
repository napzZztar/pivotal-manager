import {Component, OnInit, Input} from '@angular/core';
import {MatSnackBar} from '@angular/material';

const _ = require('lodash');
const clipboard = require('electron').remote.clipboard;

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss']
})
export class StoryComponent implements OnInit {
  @Input() story: any;
  expanded = false;
  statusMap = {
    unscheduled: 'ac_unit',
    unstarted: 'next_week',
    delivered: 'done',
    finished: 'done',
    accepted: 'done_all',
    rejected: 'close',
    started: 'play_arrow'
  };

  typeMap = {
    feature: 'stars',
    bug: 'bug_report',
    chore: 'settings',
    release: 'outlined_flag'
  };

  numberMap = {
    0: 'exposure_zero',
    1: 'looks_one',
    2: 'looks_two',
    3: 'looks_3',
    4: 'looks_4',
    5: 'looks_5'
  };

  constructor(private snackBar: MatSnackBar) {
  }

  ngOnInit() {
  }

  getShortForm(str: string) {
    return str.substr(0, 30) + (str.length >= 30 ? '..' : '');
  }

  copyText(textToCopy: string) {
    clipboard.writeText(textToCopy);

    return textToCopy;
  }

  copyBranchName(story) {
    let branchName = '';

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

    return branchName;
  }

  getAbbvr(word: string) {
    const chars = word.match(/([A-Z])|( \w)/gm);

    return chars.join('').toUpperCase().replace(/ /gm, '');
  }

  openSnackBar(message: string, action: string = 'Close') {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
