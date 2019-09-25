import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WsRundownComponent } from './ws-rundown.component';

describe('WsRundownComponent', () => {
  let component: WsRundownComponent;
  let fixture: ComponentFixture<WsRundownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WsRundownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WsRundownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
