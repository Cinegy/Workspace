import { TestBed } from '@angular/core/testing';

import { WsStoryService } from './ws-story.service';

describe('WsStoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WsStoryService = TestBed.get(WsStoryService);
    expect(service).toBeTruthy();
  });
});
