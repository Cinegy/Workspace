import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WsNewsComponent } from './ws-news.component';

describe('WsNewsComponent', () => {
  let component: WsNewsComponent;
  let fixture: ComponentFixture<WsNewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WsNewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WsNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
