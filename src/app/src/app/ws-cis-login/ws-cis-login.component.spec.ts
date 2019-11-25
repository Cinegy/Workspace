import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WsCisLoginComponent } from './ws-cis-login.component';

describe('WsCisLoginComponent', () => {
  let component: WsCisLoginComponent;
  let fixture: ComponentFixture<WsCisLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WsCisLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WsCisLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
