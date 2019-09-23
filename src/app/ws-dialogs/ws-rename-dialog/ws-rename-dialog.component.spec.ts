import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WsRenameDialogComponent } from './ws-rename-dialog.component';

describe('WsRenameDialogComponent', () => {
  let component: WsRenameDialogComponent;
  let fixture: ComponentFixture<WsRenameDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WsRenameDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WsRenameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
