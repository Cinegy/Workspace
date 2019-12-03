import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WsDeleteDialogComponent } from './ws-delete-dialog.component';

describe('WsDeleteDialogComponent', () => {
  let component: WsDeleteDialogComponent;
  let fixture: ComponentFixture<WsDeleteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WsDeleteDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WsDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
