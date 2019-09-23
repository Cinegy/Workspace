import { TestBed } from '@angular/core/testing';

import { WsExplorerService } from './ws-explorer.service';

describe('WsExplorerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WsExplorerService = TestBed.get(WsExplorerService);
    expect(service).toBeTruthy();
  });
});
