import {Component, OnInit} from '@angular/core';
import {PivotalService} from '../../services/pivotal.service';
import {Router} from '@angular/router';

const moment = require('moment');

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  projects: Project[] = [];

  constructor(private pivotal: PivotalService, private router: Router) {
  }

  ngOnInit() {
    this.setProjects();
  }

  setProjects() {
    this
      .pivotal
      .getUserInfo()
      .then(data => {
        this.projects = data.projects.filter(project => {
          const lastViewed = moment(project.lastViewedAt);

          return moment().diff(lastViewed, 'w') <= 2;
        });
      })
      .catch(console.error);
  }

  logout() {
    localStorage.apiKey = '';
    this.router.navigate(['/']);
  }

}

interface Project {
  kind: string;
  id: number;
  projectId: number;
  projectName: string;
  projectColor: string;
  favorite: boolean;
  role: string;
  lastViewedAt: string;
  isActive: boolean;
}
