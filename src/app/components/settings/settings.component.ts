import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  public projects: any[] = [];
  public members: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<SettingsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.projects = this.data.projects || [];
    this.members = this.data.members || [];
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
