import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingNoteEditComponent } from './meeting-note-edit.component';

describe('MeetingNoteEditComponent', () => {
  let component: MeetingNoteEditComponent;
  let fixture: ComponentFixture<MeetingNoteEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingNoteEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingNoteEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
