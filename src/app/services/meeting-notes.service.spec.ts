import { TestBed, inject } from '@angular/core/testing';

import { MeetingNotesService } from '../meeting-notes.service';

describe('MeetingNotesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MeetingNotesService]
    });
  });

  it('should be created', inject([MeetingNotesService], (service: MeetingNotesService) => {
    expect(service).toBeTruthy();
  }));
});
