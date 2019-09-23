import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WsMainComponent } from './ws-main.component';

describe('WsMainComponent', () => {
  let component: WsMainComponent;
  let fixture: ComponentFixture<WsMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WsMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WsMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
