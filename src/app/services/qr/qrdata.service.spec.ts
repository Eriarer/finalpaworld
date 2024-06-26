import { TestBed } from '@angular/core/testing';

import { QrdataService } from './qrdata.service';

describe('QrdataService', () => {
  let service: QrdataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QrdataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
