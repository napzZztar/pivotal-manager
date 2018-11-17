import {Component, OnInit, Input} from '@angular/core';
import {store} from '@angular/core/src/render3/instructions';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit {
  @Input() member: any;
  stories: any[];

  constructor() {
  }

  ngOnInit() {
  }

}
