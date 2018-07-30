import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WsJdfComponent } from './ws-jdf.component';

describe('WsJdfComponent', () => {
  let component: WsJdfComponent;
  let fixture: ComponentFixture<WsJdfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WsJdfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WsJdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
