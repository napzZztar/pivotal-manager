import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingNoteItemComponent } from './meeting-note-item.component';

describe('MeetingNoteItemComponent', () => {
  let component: MeetingNoteItemComponent;
  let fixture: ComponentFixture<MeetingNoteItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingNoteItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingNoteItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
