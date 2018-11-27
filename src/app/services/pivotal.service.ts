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
let needsRefresh = true;

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
    const {enabledProjects, enabledMembers, startDate, includeDone, includeUpcoming} = this.dataStorageService.getSettings();

    projects.forEach(project => {
      project.isEnabled = enabledProjects.includes(project.id);
    });


    members.forEach(member => {
      member.isEnabled = enabledMembers.includes(member.id);
    });

    return this.refreshUserStories(startDate, includeDone, includeUpcoming);
  }

  refreshUserStories(startDate: string, includeDone: boolean, includeUpcoming: boolean): Promise<any> {
    const promises = [];
    const memberMap = this.getMemberMap();
    this.members.map(member => {
      member.stories = [];
    });

    this.projects.forEach(project => {
      if (project.isEnabled) {
        promises.push(this.listStories(project, startDate, includeDone, includeUpcoming));
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

  listStories(project: any, startDate: string, includeDone: boolean = true, includeUpcoming: boolean = true) {
    const doneStates = 'accepted,delivered,finished,';
    const upcomingStates = ',planned,unstarted,unscheduled';
    const withState = `${includeDone ? doneStates : ''}started,rejected${includeUpcoming ? upcomingStates : ''}`;

    return this
      .request({
        uri: `/projects/${project.projectId}/stories`,
        qs: {
          filter: `state:${withState} updated_after:${startDate}`
        }
      })
      .then(projectStories => {
        return projectStories.map(story => {
          story.projectName = project.projectName;
          return story;
        });
      });
  }

  getStory(storyId: string) {
    return this
      .request(`/stories/${storyId}`)
      .then(story => {
        const project = this.projects.filter(p => p.projectId === story.projectId);

        if (project && project.length) {
          story.projectName = project[0].projectName;
          return Promise.resolve(story);
        } else {
          return Promise.reject(null);
        }
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

  getMemberMap() {
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

  get needsRefresh() {
    return needsRefresh;
  }

  enableRefresh() {
    needsRefresh = true;
  }

  disableRefresh() {
    needsRefresh = false;
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
