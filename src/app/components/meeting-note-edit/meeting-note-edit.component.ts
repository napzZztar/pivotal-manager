import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {PivotalService} from '../../services/pivotal.service';

@Component({
  selector: 'app-meeting-note-edit',
  templateUrl: './meeting-note-edit.component.html',
  styleUrls: ['./meeting-note-edit.component.scss']
})
export class MeetingNoteEditComponent implements OnInit {
  todo: any[] = [];
  done: any[] = [];

  constructor(pivotal: PivotalService) {
    this.todo = pivotal.stories;
    console.log(this.todo);
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
