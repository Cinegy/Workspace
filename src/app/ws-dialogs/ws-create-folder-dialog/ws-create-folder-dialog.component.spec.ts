import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WsCreateFolderDialogComponent } from './ws-create-folder-dialog.component';

describe('WsCreateFolderDialogComponent', () => {
  let component: WsCreateFolderDialogComponent;
  let fixture: ComponentFixture<WsCreateFolderDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WsCreateFolderDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WsCreateFolderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
