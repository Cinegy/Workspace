import { TestBed, inject } from '@angular/core/testing';

import { WsClipboardService } from './ws-clipboard.service';

describe('WsClipboardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WsClipboardService]
    });
  });

  it('should be created', inject([WsClipboardService], (service: WsClipboardService) => {
    expect(service).toBeTruthy();
  }));
});
