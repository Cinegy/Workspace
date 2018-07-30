import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WsLogoutComponent } from './ws-logout.component';

describe('WsLogoutComponent', () => {
  let component: WsLogoutComponent;
  let fixture: ComponentFixture<WsLogoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WsLogoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WsLogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
