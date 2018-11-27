import {Component, OnInit, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';

import {MeetingNotesService} from '../../meeting-notes.service';

@Component({
  selector: 'app-meeting-note-export',
  templateUrl: './meeting-note-export.component.html',
  styleUrls: ['./meeting-note-export.component.scss']
})
export class MeetingNoteExportComponent implements OnInit {
  classifiedStories: any;
  meetingNotes: any[] = [];

  constructor(private noteService: MeetingNotesService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.classifiedStories = data.classifiedStories;
  }

  ngOnInit() {
    this.meetingNotes = this.noteService.getNote(this.classifiedStories);
  }

}
