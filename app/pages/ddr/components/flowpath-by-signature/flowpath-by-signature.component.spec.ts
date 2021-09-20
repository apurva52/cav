import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowpathBySignatureComponent } from './flowpath-by-signature.component';

describe('FlowpathBySignatureComponent', () => {
  let component: FlowpathBySignatureComponent;
  let fixture: ComponentFixture<FlowpathBySignatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowpathBySignatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowpathBySignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
