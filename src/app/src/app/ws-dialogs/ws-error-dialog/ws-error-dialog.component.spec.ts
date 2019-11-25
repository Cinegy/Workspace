import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WsErrorDialogComponent } from './ws-error-dialog.component';

describe('WsErrorDialogComponent', () => {
  let component: WsErrorDialogComponent;
  let fixture: ComponentFixture<WsErrorDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WsErrorDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WsErrorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
