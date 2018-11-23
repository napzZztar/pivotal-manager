import {Component, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {SpinnerComponent} from '../spinner/spinner.component';


import {PivotalService} from '../../services/pivotal.service';

@Component({
  selector: 'app-task-manager',
  templateUrl: './task-manager.component.html',
  styleUrls: ['./task-manager.component.scss']
})
export class TaskManagerComponent implements OnInit {
  members: any[] = [];
  projects: any[] = [];
  dialogRef: any;
  refreshEvent: any;
  reloadEvent: any;

  constructor(private pivotalService: PivotalService, private router: Router, private dialog: MatDialog) {
    this.refreshEvent = this.refreshStories.bind(this);
    this.reloadEvent = this.refreshLists.bind(this);
  }

  ngOnInit() {
    if (this.pivotalService.needsRefresh) {
      this.setProjects();
      this.pivotalService.disableRefresh();
    } else {
      this.refreshStories();
    }
  }

  openSpinner() {
    this.dialogRef = this.dialog.open(SpinnerComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '100%'
    });
  }

  closeSpinner() {
    this.dialogRef.close();
    this.dialog.openDialogs.pop();
  }

  refreshLists() {
    this.members = this.pivotalService.members.filter(member => member.isEnabled);
    this.projects.concat(...this.pivotalService.projects.filter(project => project.isEnabled));
  }

  memberTracker(index: number, element: any) {
    return element ? element.id : null;
  }

  setProjects(showSpinner = true) {
    setTimeout(() => {
      if (showSpinner) {
        this.openSpinner();
      }
    });
    this
      .pivotalService
      .refreshUserInfo()
      .then(() => {
        return this.pivotalService.refreshMemberList();
      })
      .then(() => {
        return this.pivotalService.syncUserAndProjectStatus();
      })
      .then(() => {
        this.refreshLists();
        this.closeSpinner();
      })
      .catch((error) => {
        console.log(error);
        this.closeSpinner();
        localStorage.apiKey = '';
        this.router.navigate(['/']);
      });
  }

  refreshStories() {
    this
      .pivotalService
      .syncUserAndProjectStatus()
      .then(() => {
        this.refreshLists();
      });
  }
}

