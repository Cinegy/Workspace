import { TestBed } from '@angular/core/testing';

import { WsClipboardService } from './ws-clipboard.service';

describe('WsClipboardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WsClipboardService = TestBed.get(WsClipboardService);
    expect(service).toBeTruthy();
  });
});
