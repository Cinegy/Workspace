import { TestBed, inject } from '@angular/core/testing';

import { WsCisService } from './ws-cis.service';

describe('WsCisService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WsCisService]
    });
  });

  it('should be created', inject([WsCisService], (service: WsCisService) => {
    expect(service).toBeTruthy();
  }));
});
