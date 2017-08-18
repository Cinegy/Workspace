import { TestBed, inject } from '@angular/core/testing';

import { WsBaseMamService } from './ws-base-mam.service';

describe('WsBaseMamService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WsBaseMamService]
    });
  });

  it('should be created', inject([WsBaseMamService], (service: WsBaseMamService) => {
    expect(service).toBeTruthy();
  }));
});
