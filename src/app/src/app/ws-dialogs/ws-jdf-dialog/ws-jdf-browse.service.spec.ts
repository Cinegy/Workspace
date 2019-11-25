import { TestBed } from '@angular/core/testing';

import { WsJdfBrowseService } from './ws-jdf-browse.service';

describe('WsJdfBrowseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WsJdfBrowseService = TestBed.get(WsJdfBrowseService);
    expect(service).toBeTruthy();
  });
});
