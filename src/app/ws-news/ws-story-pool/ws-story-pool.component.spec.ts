import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WsStoryPoolComponent } from './ws-story-pool.component';

describe('WsStoryPoolComponent', () => {
  let component: WsStoryPoolComponent;
  let fixture: ComponentFixture<WsStoryPoolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WsStoryPoolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WsStoryPoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
