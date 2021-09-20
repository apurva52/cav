import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertMaintenanceComponent } from './alert-maintenance.component';

describe('AlertMaintenanceComponent', () => {
  let component: AlertMaintenanceComponent;
  let fixture: ComponentFixture<AlertMaintenanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertMaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
