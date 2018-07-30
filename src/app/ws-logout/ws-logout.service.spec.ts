import { TestBed, inject } from '@angular/core/testing';

import { WsLogoutService } from './ws-logout.service';

describe('WsLogoutService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WsLogoutService]
    });
  });

  it('should be created', inject([WsLogoutService], (service: WsLogoutService) => {
    expect(service).toBeTruthy();
  }));
});
