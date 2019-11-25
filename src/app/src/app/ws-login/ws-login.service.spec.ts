import { TestBed } from '@angular/core/testing';

import { EgsWebLoginService } from './ws-login.service';

describe('EgsWebLoginService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EgsWebLoginService = TestBed.get(EgsWebLoginService);
    expect(service).toBeTruthy();
  });
});
