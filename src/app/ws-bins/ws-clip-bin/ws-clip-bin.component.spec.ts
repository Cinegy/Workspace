import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WsClipBinComponent } from './ws-clip-bin.component';

describe('WsClipBinComponent', () => {
  let component: WsClipBinComponent;
  let fixture: ComponentFixture<WsClipBinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WsClipBinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WsClipBinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
