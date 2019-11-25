import { TestBed } from '@angular/core/testing';

import { WsBinsService } from './ws-bins.service';

describe('WsBinsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WsBinsService = TestBed.get(WsBinsService);
    expect(service).toBeTruthy();
  });
});
