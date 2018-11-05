import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {Router} from '@angular/router';


import {PivotalService} from '../../services/pivotal.service';
import {SettingsComponent} from '../settings/settings.component';

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

  constructor(public pivotal: PivotalService, private router: Router, private dialog: MatDialog) {
  }

  ngOnInit() {
    this.setProjects();
  }

  setProjects() {
    this
      .pivotal
      .refreshUserInfo();
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
    this.dialog.open(SettingsComponent, {width: '80%', data: {}});
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
