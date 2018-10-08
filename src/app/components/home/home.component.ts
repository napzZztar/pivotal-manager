import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  apiKey: string;
  peoples: string[];

  constructor() {
    this.peoples = ['AA', 'MA', 'RA'];
    this.apiKey = localStorage.apiKey;
  }

  ngOnInit() {
  }

}
