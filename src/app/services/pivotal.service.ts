import {Injectable} from '@angular/core';

import {DataStorageService} from './data-storage.service';

const camelize = require('camelize');
const moment = require('moment');
const _ = require('lodash');

const requestPromise = require('request-promise');

let projects: any[] = [];
let user: User;
let members: User[] = [];
let stories: any[] = [];

@Injectable({
  providedIn: 'root'
})
export class PivotalService {
  token: string;
  baseUrl: string;
  projects: any[] = [];
  user: User;
  members: User[];
  stories: any[];

  constructor(private dataStorageService: DataStorageService) {
    this.token = localStorage.apiKey;
    this.baseUrl = 'https://www.pivotaltracker.com/services/v5';

    this.user = user;
    this.projects = projects;
    this.members = members;
    this.stories = stories;
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
          isEnabled: false,
          stories: []
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

        members = members.map(member => {
          return {
            name: member.name,
            initials: member.initials,
            id: member.id,
            email: member.email,
            username: member.username,
            isEnabled: false,
            stories: []
          };
        });

        this.members = members;
      });
  }

  syncUserAndProjectStatus(): Promise<any> {
    const {enabledProjects, enabledMembers, startDate} = this.dataStorageService.getSettings();

    projects.forEach(project => {
      project.isEnabled = enabledProjects.includes(project.id);
    });


    members.forEach(member => {
      member.isEnabled = enabledMembers.includes(member.id);
    });

    return this.refreshUserStories(startDate);
  }

  refreshUserStories(startDate: string): Promise<any> {
    const promises = [];
    const memberMap = this._getMemberMap();
    this.members.map(member => {
      member.stories = [];
    });

    this.projects.forEach(project => {
      if (project.isEnabled) {
        promises.push(this.listStories(project, startDate));
      }
    });

    return Promise
      .all(promises)
      .then(results => {
        stories = [];

        results.forEach(projectStories => {
          stories = stories.concat(...projectStories);
          this._pushStiesToMembers(memberMap, projectStories);
        });

        this.members.forEach(member => {
          member.stories = _.orderBy(member.stories, 'updatedAt');
        });

        this.stories = stories;
      });
  }

  listStories(project: any, startDate: string) {
    return this
      .request({
        uri: `/projects/${project.projectId}/stories`,
        qs: {
          updated_after: startDate
        }
      })
      .then(projectStories => {
        return projectStories.map(story => {
          story.projectName = project.projectName;
          return story;
        });
      });
  }

  _pushStiesToMembers(memberMap, projectStories) {
    projectStories.forEach((story) => {
      story.ownerIds.forEach(ownerId => {
        if (memberMap[ownerId] && memberMap[ownerId].isEnabled) {
          story.expanded = false;

          if (ownerId === user.id) {
            story.isEnabled = true;
          }
          memberMap[ownerId].stories.push(story);
        }
      });
    });
  }

  _getMemberMap() {
    const map = {};

    this.members.forEach(member => {
      map[member.id] = member;
    });

    return map;
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
      options.uri = this.baseUrl + options.uri;

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
  stories: any[];
}
