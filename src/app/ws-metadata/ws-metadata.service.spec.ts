import { TestBed } from '@angular/core/testing';

import { WsMetadataService } from './ws-metadata.service';

describe('WsMetadataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WsMetadataService = TestBed.get(WsMetadataService);
    expect(service).toBeTruthy();
  });
});
