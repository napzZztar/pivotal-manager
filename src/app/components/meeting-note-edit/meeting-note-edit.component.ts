import {Component, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {MatDialog} from '@angular/material';


import {PivotalService} from '../../services/pivotal.service';
import {MeetingNotesService} from '../../meeting-notes.service';
import {MeetingNoteAddStoryModalComponent} from '../meeting-note-add-story-modal/meeting-note-add-story-modal.component';

const _ = require('lodash');

@Component({
  selector: 'app-meeting-note-edit',
  templateUrl: './meeting-note-edit.component.html',
  styleUrls: ['./meeting-note-edit.component.scss']
})
export class MeetingNoteEditComponent implements OnInit {
  excluded: any = [];
  stories: any[] = [];
  statusMap = {
    unscheduled: 'ac_unit',
    unstarted: 'playlist_add_',
    delivered: 'done',
    finished: 'done',
    accepted: 'done_all',
    rejected: 'close',
    started: 'play_arrow'
  };
  classifiedStories: any = {
    completed: [],
    continued: [],
    postponed: [],
    cancelled: [],
    new: []
  };

  constructor(private pivotal: PivotalService, private meetingNotesService: MeetingNotesService, private dialog: MatDialog) {
    this.stories = this.pivotal.stories;
  }

  ngOnInit() {
    const memberMap = this.pivotal.getMemberMap();
    this.classifiedStories = this
      .meetingNotesService
      .classifyMeetingStories(this.pivotal.user, memberMap, this.stories);
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }


  openAddStoryDialog() {
    const dialogueRef = this.dialog.open(MeetingNoteAddStoryModalComponent, {
      width: '60%', data: {
        projects: this.pivotal.projects
      }
    });

    dialogueRef.afterClosed().subscribe(stories => {
      let existingStories = this.classifiedStories.completed.concat(...this.classifiedStories.continued);
      existingStories = existingStories.concat(...this.classifiedStories.cancelled);
      existingStories = existingStories.concat(...this.classifiedStories.postponed);
      existingStories = existingStories.concat(...this.classifiedStories.new);
      existingStories = existingStories.concat(...this.excluded);

      const newStories = _.pullAllBy(stories, existingStories, 'id');

      this.classifiedStories.new.push(...newStories);
    });
  }
}