import { TestBed } from '@angular/core/testing';

import { CitasFbService } from './citas-fb.service';

describe('CitasFbService', () => {
  let service: CitasFbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CitasFbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
