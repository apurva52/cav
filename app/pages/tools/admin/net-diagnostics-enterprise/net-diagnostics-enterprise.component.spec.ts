import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetDiagnosticsEnterpriseComponent } from './net-diagnostics-enterprise.component';

describe('NetDiagnosticsEnterpriseComponent', () => {
  let component: NetDiagnosticsEnterpriseComponent;
  let fixture: ComponentFixture<NetDiagnosticsEnterpriseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetDiagnosticsEnterpriseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetDiagnosticsEnterpriseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
