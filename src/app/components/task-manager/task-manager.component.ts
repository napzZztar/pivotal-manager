import {Component, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';

import {PivotalService} from '../../services/pivotal.service';

@Component({
  selector: 'app-task-manager',
  templateUrl: './task-manager.component.html',
  styleUrls: ['./task-manager.component.scss']
})
export class TaskManagerComponent implements OnInit {
  members: any[] = [];
  projects: any[] = [];

  constructor(private pivotalService: PivotalService, private router: Router) {
  }

  ngOnInit() {
    this.setProjects();
  }

  refreshLists() {
    this.members = this.pivotalService.members.filter(member => member.isEnabled);
    this.projects.concat(...this.pivotalService.projects.filter(project => project.isEnabled));
  }

  memberTracker(index: number, element: any) {
    return element ? element.id : null;
  }

  setProjects() {
    this
      .pivotalService
      .refreshUserInfo()
      .then(() => {
        return this.pivotalService.refreshMemberList();
      })
      .then(() => {
        this.pivotalService.syncUserAndProjectStatus();
        this.refreshLists();
      })
      .catch(() => {
        localStorage.apiKey = '';
        this.router.navigate(['/']);
      });
  }
}

