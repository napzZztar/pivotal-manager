import { Component, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
const {clipboard} = require('electron');



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(
    public dialogRef: MatDialogRef<LoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: String) {}

  onNoClick(): void {
    this.dialogRef.close();
    const {remote} = require('electron');
    const w = remote.getCurrentWindow();
    w.close();
  }

  checkAndPastClip(): void {
    const copiedText = clipboard.readText('selection');
    if (/^[a-z0-9]{32}$/.test(copiedText) && !this.data) {
      this.data = copiedText;
    }
  }
}


