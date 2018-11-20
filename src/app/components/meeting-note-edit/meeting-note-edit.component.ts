import {Component, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {PivotalService} from '../../services/pivotal.service';

@Component({
  selector: 'app-meeting-note-edit',
  templateUrl: './meeting-note-edit.component.html',
  styleUrls: ['./meeting-note-edit.component.scss']
})
export class MeetingNoteEditComponent implements OnInit {
  excluded: any = [];
  statusMap = {
    unscheduled: 'ac_unit',
    unstarted: 'playlist_add_',
    delivered: 'done',
    finished: 'done',
    accepted: 'done_all',
    rejected: 'close',
    started: 'play_arrow'
  };
  stories: any = {
    completed: [],
    continued: [],
    postponed: [],
    cancelled: [],
    new: []
  };

  constructor(private pivotal: PivotalService) {
    this.stories.completed = this.pivotal.stories
      .filter(story => story.isEnabled && (story.currentState === 'delivered' || story.currentState === 'finished' || story.currentState === 'accepted'));
    this.stories.continued = this.pivotal.stories.filter(story => story.isEnabled && story.currentState === 'started');
    console.log(this.pivotal.stories);
  }

  ngOnInit() {
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
}
