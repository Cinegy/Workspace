import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EgsWebUserInfoDialogComponent } from './ws-user-info-dialog.component';

describe('EgsWebUserInfoDialogComponent', () => {
  let component: EgsWebUserInfoDialogComponent;
  let fixture: ComponentFixture<EgsWebUserInfoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EgsWebUserInfoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EgsWebUserInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
