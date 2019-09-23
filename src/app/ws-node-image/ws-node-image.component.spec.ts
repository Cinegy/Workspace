import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WsNodeImageComponent } from './ws-node-image.component';

describe('WsNodeImageComponent', () => {
  let component: WsNodeImageComponent;
  let fixture: ComponentFixture<WsNodeImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WsNodeImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WsNodeImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
