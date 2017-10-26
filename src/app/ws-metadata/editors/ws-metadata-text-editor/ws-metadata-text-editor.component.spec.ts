import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WsMetadataTextEditorComponent } from './ws-metadata-text-editor.component';

describe('WsMetadataTextEditorComponent', () => {
  let component: WsMetadataTextEditorComponent;
  let fixture: ComponentFixture<WsMetadataTextEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WsMetadataTextEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WsMetadataTextEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
