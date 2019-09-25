import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WsPlayerComponent } from './ws-player.component';

describe('WsPlayerComponent', () => {
  let component: WsPlayerComponent;
  let fixture: ComponentFixture<WsPlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WsPlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WsPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
