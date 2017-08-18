import { TestBed, inject } from '@angular/core/testing';

import { WsAppStateService } from './ws-app-state.service';

describe('WsAppStateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WsAppStateService]
    });
  });

  it('should be created', inject([WsAppStateService], (service: WsAppStateService) => {
    expect(service).toBeTruthy();
  }));
});
