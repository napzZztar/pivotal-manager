import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingNoteAddStoryModalComponent } from './meeting-note-add-story-modal.component';

describe('MeetingNoteAddStoryModalComponent', () => {
  let component: MeetingNoteAddStoryModalComponent;
  let fixture: ComponentFixture<MeetingNoteAddStoryModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingNoteAddStoryModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingNoteAddStoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
