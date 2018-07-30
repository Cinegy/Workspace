import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WsUploadComponent } from './ws-upload.component';

describe('WsUploadComponent', () => {
  let component: WsUploadComponent;
  let fixture: ComponentFixture<WsUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WsUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WsUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
