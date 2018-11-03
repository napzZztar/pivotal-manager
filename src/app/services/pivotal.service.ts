import {Injectable} from '@angular/core';

const camelize = require('camelize');
const moment = require('moment');

const requestPromise = require('request-promise');

let projects: any[] = [];
let user: User;

@Injectable({
  providedIn: 'root'
})
export class PivotalService {
  token: string;
  baseUrl: string;
  projects: any[] = [];
  user: User;

  constructor() {
    this.token = localStorage.apiKey;
    this.baseUrl = 'https://www.pivotaltracker.com/services/v5';
  }

  refreshUserInfo(): void {
    this
      .request('/me')
      .then(data => {
        user = {
          name: data.name,
          initials: data.initials,
          id: data.id,
          email: data.email,
          username: data.username
        };

        projects = data.projects.filter(project => {
          const lastViewed = moment(project.lastViewedAt);

          return moment().diff(lastViewed, 'w') <= 2;
        });

        this.user = user;
        this.projects = projects;
      });
  }

  private request(options: any) {
    const requestOptions: any = {
      headers: {
        'X-TrackerToken': this.token
      },
      json: true
    };

    if (typeof options === 'string') {
      requestOptions.url = this.baseUrl + options;
      requestOptions.method = 'GET';
    } else {
      options.url = this.baseUrl + options.url;

      Object.assign(requestOptions, options);
    }

    return requestPromise(requestOptions)
      .then(data => {
        const response = {};

        return Promise.resolve(camelize(data));
      });
  }
}

interface User {
  name: string;
  email: string;
  initials: string;
  id: number;
  username: string;
}
