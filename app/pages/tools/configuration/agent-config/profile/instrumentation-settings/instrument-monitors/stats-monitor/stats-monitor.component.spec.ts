import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsMonitorComponent } from './stats-monitor.component';

describe('StatsMonitorComponent', () => {
  let component: StatsMonitorComponent;
  let fixture: ComponentFixture<StatsMonitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatsMonitorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatsMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
