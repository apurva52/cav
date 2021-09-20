import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KubernetsMonitoringComponent } from './kubernets-monitoring.component';

describe('KubernetsMonitoringComponent', () => {
  let component: KubernetsMonitoringComponent;
  let fixture: ComponentFixture<KubernetsMonitoringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KubernetsMonitoringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KubernetsMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
