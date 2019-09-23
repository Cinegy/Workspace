import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WsInfoDialogComponent } from './ws-info-dialog.component';

describe('WsInfoDialogComponent', () => {
  let component: WsInfoDialogComponent;
  let fixture: ComponentFixture<WsInfoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WsInfoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WsInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
