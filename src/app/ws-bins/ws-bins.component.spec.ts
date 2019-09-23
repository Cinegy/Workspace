import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WsBinsComponent } from './ws-bins.component';

describe('WsBinsComponent', () => {
  let component: WsBinsComponent;
  let fixture: ComponentFixture<WsBinsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WsBinsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WsBinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
