import { TestBed, inject } from '@angular/core/testing';

import { WsExplorerService } from './ws-explorer.service';

describe('WsExplorerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WsExplorerService]
    });
  });

  it('should be created', inject([WsExplorerService], (service: WsExplorerService) => {
    expect(service).toBeTruthy();
  }));
});
