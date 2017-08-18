import { TestBed, inject } from '@angular/core/testing';

import { WsMainBreadcrumbsService } from './ws-main-breadcrumbs.service';

describe('WsMainBreadcrumbsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WsMainBreadcrumbsService]
    });
  });

  it('should be created', inject([WsMainBreadcrumbsService], (service: WsMainBreadcrumbsService) => {
    expect(service).toBeTruthy();
  }));
});
