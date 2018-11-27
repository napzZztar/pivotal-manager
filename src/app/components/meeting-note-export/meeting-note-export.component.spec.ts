import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingNoteExportComponent } from './meeting-note-export.component';

describe('MeetingNoteExportComponent', () => {
  let component: MeetingNoteExportComponent;
  let fixture: ComponentFixture<MeetingNoteExportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingNoteExportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingNoteExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
