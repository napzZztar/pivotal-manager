import {Injectable} from '@angular/core';

const _ = require('lodash');

@Injectable({
  providedIn: 'root'
})
export class MeetingNotesService {

  constructor() {
  }

  classifyMeetingStories(user, memberMap, stories, previousMeetingNote = []) {
    const classifiedStories = {
      completed: [],
      continued: [],
      postponed: [],
      cancelled: [],
      new: []
    };

    stories.forEach(story => {
      if (story.isEnabled) {
        const wasInLastNote = previousMeetingNote.find(noteStory => noteStory.id === story.id);

        story.comment = '';
        story.prePlanned = wasInLastNote ? 'Yes' : 'No';
        story.ownerKeys = story.ownerIds.map(id => memberMap[id].initials);

        const isMine = story.ownerIds.find(id => id === user.id);

        if (!isMine) {
          classifiedStories.cancelled.push(story);
          story.comment = 'Transferred to ' + story.ownerIds.map(id => memberMap[id].name).join(', ');

          return;
        }

        switch (story.currentState) {
          case 'delivered':
          case 'finished':
          case 'accepted':
            classifiedStories.completed.push(story);
            break;
          case 'started':
            classifiedStories.continued.push(story);
            break;
          default:

            if (wasInLastNote) {
              classifiedStories.postponed.push(story);
              story.comment = 'Due to priority';
            } else {
              story.prePlanned = '';
              classifiedStories.new.push(story);
            }
        }
      }
    });

    return classifiedStories;
  }

  getNote(classifiedStories: any) {
    const meetingNote: any[] = [];
    const projects: string[] = [];
    const projectStoriesMap: any = {};

    // Not running a loop cz, the sequence is important
    ['completed', 'continued', 'postponed', 'cancelled', 'new'].forEach(category => {
      this._includeStoryCategory(category, classifiedStories[category], projects, projectStoriesMap);
    });

    projects.forEach(projectId => {
      const projectStories = projectStoriesMap[projectId].map((story, index ) => {
        story.slNo = index + 1;
        return story;
      });

      meetingNote.push({
        isProject: true,
        projectName: projectStories[0].projectName
      });

      meetingNote.push(...projectStories);
    });

    return meetingNote;
  }

  _includeStoryCategory(category, categoryItems, projects, projectStories) {
    categoryItems.forEach((story, slNo) => {
      const projectId = story.projectId;

      story.status = category === 'new' ? '' : _.startCase(category);

      if (category === 'postponed') {
        story.isPrePlanned = 'Yes';
      } else if (category === 'new') {
        story.isPrePlanned = '';
      } else {
        story.isPrePlanned = 'No';
      }

      if (projectStories[projectId]) {
        projectStories[projectId].push(story);
      } else {
        projects.push(projectId);
        projectStories[projectId] = [story];
      }
    });
  }
}
