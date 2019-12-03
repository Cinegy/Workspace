import { TestBed } from '@angular/core/testing';

import { WsMainBreadcrumbsService } from './ws-main-breadcrumbs.service';

describe('WsMainBreadcrumbsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WsMainBreadcrumbsService = TestBed.get(WsMainBreadcrumbsService);
    expect(service).toBeTruthy();
  });
});
