import { TestBed } from '@angular/core/testing';

import { WsNewsService } from './ws-news.service';

describe('WsNewsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WsNewsService = TestBed.get(WsNewsService);
    expect(service).toBeTruthy();
  });
});
