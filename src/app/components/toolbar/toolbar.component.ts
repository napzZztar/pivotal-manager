import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  projects: Project[];

  constructor() { }

  ngOnInit() {
    this.projects = [{id: 12345, title: 'SmarterProctoring'}, {id: 12345, title: 'SmarterScheduling'}];
  }

}

interface Project {
  id: number;
  title: string
}
