import { Component, OnInit } from '@angular/core';
import {LoginComponent} from '../login/login.component';
import {MatDialog} from '@angular/material';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  apiKey: string;
  peoples: string[];

  constructor(public dialog: MatDialog) {
    this.peoples = ['AA', 'MA', 'RA'];
    this.apiKey = localStorage.apiKey;
  }

  ngOnInit() {
    if (!this.apiKey) {
      setTimeout(() => {
        this.openLogin();
      }, 10);
    }
  }

  openLogin(): void {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '325px',
      data: ''
    });

    dialogRef.afterClosed().subscribe(result => {
      this.apiKey = result;
      localStorage.apiKey = this.apiKey || '';
    });
  }

}
