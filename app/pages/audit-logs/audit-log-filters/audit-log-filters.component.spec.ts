import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditLogFiltersComponent } from './audit-log-filters.component';

describe('AuditLogFiltersComponent', () => {
  let component: AuditLogFiltersComponent;
  let fixture: ComponentFixture<AuditLogFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditLogFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditLogFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
