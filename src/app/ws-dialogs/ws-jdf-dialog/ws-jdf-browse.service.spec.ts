import { TestBed, inject } from '@angular/core/testing';

import { WsJdfBrowseService } from './ws-jdf-browse.service';

describe('WsJdfBrowseService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WsJdfBrowseService]
    });
  });

  it('should be created', inject([WsJdfBrowseService], (service: WsJdfBrowseService) => {
    expect(service).toBeTruthy();
  }));
});
