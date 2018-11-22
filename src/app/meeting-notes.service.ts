import {Injectable} from '@angular/core';

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
}
