import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagnosticsConfigurationComponent } from './diagnostics-configuration.component';

describe('DiagnosticsConfigurationComponent', () => {
  let component: DiagnosticsConfigurationComponent;
  let fixture: ComponentFixture<DiagnosticsConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiagnosticsConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiagnosticsConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
