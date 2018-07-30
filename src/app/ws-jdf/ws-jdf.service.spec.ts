import { TestBed, inject } from '@angular/core/testing';

import { WsJdfService } from './ws-jdf.service';

describe('WsJdfService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WsJdfService]
    });
  });

  it('should be created', inject([WsJdfService], (service: WsJdfService) => {
    expect(service).toBeTruthy();
  }));
});
