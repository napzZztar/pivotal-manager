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
    const length = parseInt((Math.random() * 10).toString(), null) + 8;
    this.stories = Array(length).fill(1).map((v, i) => i);
  }

  ngOnInit() {
  }

}
