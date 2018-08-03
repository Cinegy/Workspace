import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WsJdfDialogComponent } from './ws-jdf-dialog.component';

describe('WsJdfDialogComponent', () => {
  let component: WsJdfDialogComponent;
  let fixture: ComponentFixture<WsJdfDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WsJdfDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WsJdfDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
