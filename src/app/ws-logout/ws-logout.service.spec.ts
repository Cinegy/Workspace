import { TestBed } from '@angular/core/testing';

import { WsLogoutService } from './ws-logout.service';

describe('WsLogoutService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WsLogoutService = TestBed.get(WsLogoutService);
    expect(service).toBeTruthy();
  });
});
