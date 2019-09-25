import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WsCreateBinDialogComponent } from './ws-create-bin-dialog.component';

describe('WsCreateBinDialogComponent', () => {
  let component: WsCreateBinDialogComponent;
  let fixture: ComponentFixture<WsCreateBinDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WsCreateBinDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WsCreateBinDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
