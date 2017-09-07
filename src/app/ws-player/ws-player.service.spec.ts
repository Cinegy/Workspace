import { TestBed, inject } from '@angular/core/testing';

import { WsPlayerService } from './ws-player.service';

describe('WsPlayerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WsPlayerService]
    });
  });

  it('should be created', inject([WsPlayerService], (service: WsPlayerService) => {
    expect(service).toBeTruthy();
  }));
});
