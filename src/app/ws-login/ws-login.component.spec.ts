import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WsLoginComponent } from './ws-login.component';

describe('WsLoginComponent', () => {
  let component: WsLoginComponent;
  let fixture: ComponentFixture<WsLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WsLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WsLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
