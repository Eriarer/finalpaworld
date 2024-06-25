import { TestBed } from '@angular/core/testing';

import { UsersFbService } from './users-fb.service';

describe('UsersFbService', () => {
  let service: UsersFbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersFbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
