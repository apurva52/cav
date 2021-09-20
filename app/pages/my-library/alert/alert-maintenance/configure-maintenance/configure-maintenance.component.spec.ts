import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureMaintenanceComponent } from './configure-maintenance.component';

describe('ConfigureMaintenanceComponent', () => {
  let component: ConfigureMaintenanceComponent;
  let fixture: ComponentFixture<ConfigureMaintenanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigureMaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
