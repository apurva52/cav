import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DBMonitoringComponent } from './db-monitoring.component';

describe('DBMonitoringComponent', () => {
  let component: DBMonitoringComponent;
  let fixture: ComponentFixture<DBMonitoringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DBMonitoringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DBMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
