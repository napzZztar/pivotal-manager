import {Component, OnInit, Input} from '@angular/core';
import {MatDialog} from '@angular/material';
import {Router} from '@angular/router';


import {PivotalService} from '../../services/pivotal.service';
import {SettingsComponent} from '../settings/settings.component';
import {TaskManagerComponent} from '../task-manager/task-manager.component';

const _ = require('lodash');

const moment = require('moment');

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  logoutClicked: Boolean = false;
  logoutIcon = 'power_settings_new';
  projects: Project[] = [];
  @Input() refresh: any;

  constructor(public pivotal: PivotalService, private router: Router, private dialog: MatDialog) {
  }

  ngOnInit() {
  }


  logout() {
    if (this.logoutClicked) {
      localStorage.apiKey = '';
      const {remote} = require('electron');
      const w = remote.getCurrentWindow();
      w.close();
    } else {
      this.logoutClicked = true;
      this.logoutIcon = 'exit_to_app';

      setTimeout(() => {
        this.logoutClicked = false;
        this.logoutIcon = 'power_settings_new';
      }, 1500);
    }
  }

  openSettings() {
    const dialogueRef = this.dialog.open(SettingsComponent, {
      width: '80%', data: {
        projects: _.cloneDeep(this.pivotal.projects),
        members: _.cloneDeep(this.pivotal.members)
      }
    });

    dialogueRef.afterClosed().subscribe(() => {
      if (this.refresh) {
        this.refresh();
      }
    });
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
