import { TestBed, inject } from '@angular/core/testing';

import { WsLoginService } from './ws-login.service';

describe('WsLoginService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WsLoginService]
    });
  });

  it('should be created', inject([WsLoginService], (service: WsLoginService) => {
    expect(service).toBeTruthy();
  }));
});
