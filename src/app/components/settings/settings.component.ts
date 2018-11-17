import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {DataStorageService} from '../../services/data-storage.service';
import {PivotalService} from '../../services/pivotal.service';
import {TaskManagerComponent} from '../task-manager/task-manager.component';

const _ = require('lodash');
const moment = require('moment');

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  public projects: any[] = [];
  public members: any[] = [];
  public saveText = 'Save';
  public maxDate = moment().toISOString();
  public settingsData: any;

  constructor(
    public dialogRef: MatDialogRef<SettingsComponent>,
    private dataStorageService: DataStorageService,
    private pivotalService: PivotalService,
    private taskManagerComponent: TaskManagerComponent,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  ngOnInit() {
    this.projects = this.data.projects || [];
    this.members = this.data.members || [];

    this.initializeSettings();
  }


  initializeSettings() {
    this.settingsData = Object.assign({
      includeDone: true,
      includeUpcoming: true,
      trackHistory: true,
      startDate: new FormControl(moment().subtract(1, 'w').toISOString()),
      enabledProjects: [],
      enabledMembers: []
    }, this.dataStorageService.getSettings());

    if (typeof this.settingsData.startDate === 'string') {
      this.settingsData.startDate = new FormControl(this.settingsData.startDate);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


  saveSettings() {
    this.saveText = 'Saving...';
    const settings = _.cloneDeep(this.settingsData);

    settings.startDate = this.settingsData.startDate.value;

    this
      .dataStorageService
      .saveSettings(settings)
      .then(() => {
        this.saveText = 'Saved';

        this.pivotalService.syncUserAndProjectStatus();
        this.taskManagerComponent.refreshLists();

        setTimeout(() => {
          this.dialogRef.close();
        }, 500);
      })
      .catch((error) => {
        console.log(error);
        this.saveText = 'Error';
        setTimeout(() => {
          this.saveText = 'Save';
        }, 500);
      });
  }
}
