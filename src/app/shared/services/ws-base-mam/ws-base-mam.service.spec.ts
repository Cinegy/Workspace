import { TestBed } from '@angular/core/testing';

import { WsBaseMamService } from './ws-base-mam.service';

describe('WsBaseMamService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WsBaseMamService = TestBed.get(WsBaseMamService);
    expect(service).toBeTruthy();
  });
});
