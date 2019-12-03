import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WsMainMenuComponent } from './ws-main-menu.component';

describe('WsMainMenuComponent', () => {
  let component: WsMainMenuComponent;
  let fixture: ComponentFixture<WsMainMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WsMainMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WsMainMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
