import { Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-meeting-note-item',
  templateUrl: './meeting-note-item.component.html',
  styleUrls: ['./meeting-note-item.component.scss']
})
export class MeetingNoteItemComponent implements OnInit {
  @Input() story: any;
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

  constructor() { }

  ngOnInit() {
  }

}
