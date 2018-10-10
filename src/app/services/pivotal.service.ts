import {Injectable} from '@angular/core';

const camelize = require('camelize');

const requestPromise = require('request-promise');

@Injectable({
  providedIn: 'root'
})
export class PivotalService {
  token: string;
  baseUrl: string;

  constructor() {
    this.token = localStorage.apiKey;
    this.baseUrl = 'https://www.pivotaltracker.com/services/v5';
  }

  getUserInfo(): Promise<any> {
    return this
      .request('/me');
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

