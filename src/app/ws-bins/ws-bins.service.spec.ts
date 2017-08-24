import { TestBed, inject } from '@angular/core/testing';

import { WsBinsService } from './ws-bins.service';

describe('WsBinsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WsBinsService]
    });
  });

  it('should be created', inject([WsBinsService], (service: WsBinsService) => {
    expect(service).toBeTruthy();
  }));
});
