import { TestBed } from '@angular/core/testing';

import { WsJdfService } from './ws-jdf.service';

describe('WsJdfService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WsJdfService = TestBed.get(WsJdfService);
    expect(service).toBeTruthy();
  });
});
