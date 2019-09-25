import { TestBed } from '@angular/core/testing';

import { WsPlayerService } from './ws-player.service';

describe('WsPlayerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WsPlayerService = TestBed.get(WsPlayerService);
    expect(service).toBeTruthy();
  });
});
