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

  copyMeetingNote() {
    this._selectElementContents(document.getElementById('note-table'));
    document.execCommand('copy');
  }

  _selectElementContents(el) {
    let range;
    let sel;
    const body: any = document.body;

    if (document.createRange && window.getSelection) {
      range = document.createRange();
      sel = window.getSelection();
      sel.removeAllRanges();
      try {
        range.selectNodeContents(el);
        sel.addRange(range);
      } catch (e) {
        range.selectNode(el);
        sel.addRange(range);
      }
    } else if (body.createTextRange) {
      range = body.createTextRange();
      range.moveToElementText(el);
      range.select();
    }
  }

}
