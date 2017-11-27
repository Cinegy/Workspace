import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WsUserInfoDialogComponent } from './ws-user-info-dialog.component';

describe('WsUserInfoDialogComponent', () => {
  let component: WsUserInfoDialogComponent;
  let fixture: ComponentFixture<WsUserInfoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WsUserInfoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WsUserInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
