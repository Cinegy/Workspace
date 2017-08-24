import { TestBed, inject } from '@angular/core/testing';

import { WsMetadataService } from './ws-metadata.service';

describe('WsMetadataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WsMetadataService]
    });
  });

  it('should be created', inject([WsMetadataService], (service: WsMetadataService) => {
    expect(service).toBeTruthy();
  }));
});
