import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WsStoryComponent } from './ws-story.component';

describe('WsStoryComponent', () => {
  let component: WsStoryComponent;
  let fixture: ComponentFixture<WsStoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WsStoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WsStoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
