import { TestBed, inject } from '@angular/core/testing';

import { WsConfigurationService } from './ws-configuration.service';

describe('WsConfigurationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WsConfigurationService]
    });
  });

  it('should be created', inject([WsConfigurationService], (service: WsConfigurationService) => {
    expect(service).toBeTruthy();
  }));
});
