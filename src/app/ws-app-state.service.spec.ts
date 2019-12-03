import { TestBed } from '@angular/core/testing';

import { WsAppStateService } from './ws-app-state.service';

describe('WsAppStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WsAppStateService = TestBed.get(WsAppStateService);
    expect(service).toBeTruthy();
  });
});
