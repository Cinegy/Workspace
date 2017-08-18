import { TestBed, inject } from '@angular/core/testing';

import { WsAuthGuardService } from './ws-auth-guard.service';

describe('WsAuthGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WsAuthGuardService]
    });
  });

  it('should be created', inject([WsAuthGuardService], (service: WsAuthGuardService) => {
    expect(service).toBeTruthy();
  }));
});
