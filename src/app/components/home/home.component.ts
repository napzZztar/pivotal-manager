import {Component, OnInit} from '@angular/core';
import {LoginComponent} from '../login/login.component';
import {MatDialog} from '@angular/material';
import {Router} from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  apiKey: string;
  peoples: string[];

  constructor(public dialog: MatDialog, private router: Router) {
    this.peoples = ['AA', 'MA', 'RA'];
    this.apiKey = localStorage.apiKey;
  }

  ngOnInit() {
    if (!this.apiKey) {
      setTimeout(() => {
        this.router.navigate(['/']);
        this.openLogin();
      }, 10);
    } else {
      this.goToTasks();
    }
  }

  openLogin(): void {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '325px',
      data: '',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.apiKey = result;
      localStorage.apiKey = this.apiKey || '';
      this.goToTasks();
    });
  }

  private goToTasks() {
    this.router.navigate(['/task-manager']);
  }
}
