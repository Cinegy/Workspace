import { TestBed, inject } from '@angular/core/testing';
import { WsGlobalErrorHandler } from './ws-global-error-handler';


describe('WsGlobalErrorHandler', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WsGlobalErrorHandler]
    });
  });

  it('should be created', inject([WsGlobalErrorHandler], (service: WsGlobalErrorHandler) => {
    expect(service).toBeTruthy();
  }));
});
