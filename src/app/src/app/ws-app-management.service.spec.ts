import { TestBed } from '@angular/core/testing';

import { WsAppManagementService } from './ws-app-management.service';

describe('WsAppManagementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WsAppManagementService = TestBed.get(WsAppManagementService);
    expect(service).toBeTruthy();
  });
});
