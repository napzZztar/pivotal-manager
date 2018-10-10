import { TestBed, inject } from '@angular/core/testing';

import { PivotalService } from './pivotal.service';

describe('PivotalService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PivotalService]
    });
  });

  it('should be created', inject([PivotalService], (service: PivotalService) => {
    expect(service).toBeTruthy();
  }));
});
