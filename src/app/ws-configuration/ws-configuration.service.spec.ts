import { TestBed } from '@angular/core/testing';

import { WsConfigurationService } from './ws-configuration.service';

describe('WsConfigurationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WsConfigurationService = TestBed.get(WsConfigurationService);
    expect(service).toBeTruthy();
  });
});
