import { TestBed } from '@angular/core/testing';

import { WsCisService } from './ws-cis.service';

describe('WsCisService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WsCisService = TestBed.get(WsCisService);
    expect(service).toBeTruthy();
  });
});
