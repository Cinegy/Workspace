import { TestBed } from '@angular/core/testing';

import { WsAuthGuardService } from './ws-auth-guard.service';

describe('WsAuthGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WsAuthGuardService = TestBed.get(WsAuthGuardService);
    expect(service).toBeTruthy();
  });
});
