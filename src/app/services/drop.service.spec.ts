import { TestBed } from '@angular/core/testing';

import { DropService } from './drop.service';

describe('DropService', () => {
  let service: DropService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DropService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
