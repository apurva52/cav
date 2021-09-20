import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClusterMonitorComponent } from './cluster-monitor.component';

describe('ClusterMonitorComponent', () => {
  let component: ClusterMonitorComponent;
  let fixture: ComponentFixture<ClusterMonitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClusterMonitorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClusterMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
