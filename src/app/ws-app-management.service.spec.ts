import { TestBed, inject } from '@angular/core/testing';

import { WsAppManagementService } from './ws-app-management.service';

describe('WsAppManagementService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WsAppManagementService]
    });
  });

  it('should be created', inject([WsAppManagementService], (service: WsAppManagementService) => {
    expect(service).toBeTruthy();
  }));
});
