import {Injectable} from '@angular/core';

import {DataStorageService} from './data-storage.service';

const camelize = require('camelize');
const moment = require('moment');
const _ = require('lodash');

const requestPromise = require('request-promise');

let projects: any[] = [];
let user: User;
let members: User[] = [];

@Injectable({
  providedIn: 'root'
})
export class PivotalService {
  token: string;
  baseUrl: string;
  projects: any[] = [];
  user: User;
  members: User[];

  constructor(private dataStorageService: DataStorageService) {
    this.token = localStorage.apiKey;
    this.baseUrl = 'https://www.pivotaltracker.com/services/v5';

    this.user = user;
    this.projects = projects;
    this.members = members;
  }

  refreshUserInfo(): Promise<any> {
    return this
      .request('/me')
      .then(data => {
        user = {
          name: data.name,
          initials: data.initials,
          id: data.id,
          email: data.email,
          username: data.username,
          isEnabled: false
        };

        projects = data.projects.filter(project => {
          const lastViewed = moment(project.lastViewedAt);

          return moment().diff(lastViewed, 'w') <= 2;
        });

        this.user = user;
        this.projects = projects;
      });
  }


  refreshMemberList(): Promise<any> {
    const promises = [];
    projects.forEach(project => {
      const tempPromise = this
        .request(`/projects/${project.projectId}/memberships`)
        .then(memberships => {
          return memberships.map(membership => {
            const member = membership.person;

            return {
              name: member.name,
              initials: member.initials,
              id: member.id,
              email: member.email,
              username: member.username
            };
          });
        });
      promises.push(tempPromise);
    });

    return Promise
      .all(promises)
      .then(memberships => {
        members = _.orderBy(_.uniqBy([].concat(...memberships), 'id'), 'initials');

        this.members = members;
      });
  }

  syncUserAndProjectStatus() {
    const {enabledProjects, enabledMembers} = this.dataStorageService.getSettings();

    projects.forEach(project => {
      project.isEnabled = enabledProjects.includes(project.id);
    });


    members.forEach(member => {
      member.isEnabled = enabledMembers.includes(member.id);
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
  isEnabled: boolean;
}
