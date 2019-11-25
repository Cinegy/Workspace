import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WsMetadataComponent } from './ws-metadata.component';

describe('WsMetadataComponent', () => {
  let component: WsMetadataComponent;
  let fixture: ComponentFixture<WsMetadataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WsMetadataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WsMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
