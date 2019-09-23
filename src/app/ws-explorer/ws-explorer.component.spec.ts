import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WsExplorerComponent } from './ws-explorer.component';

describe('WsExplorerComponent', () => {
  let component: WsExplorerComponent;
  let fixture: ComponentFixture<WsExplorerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WsExplorerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WsExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
