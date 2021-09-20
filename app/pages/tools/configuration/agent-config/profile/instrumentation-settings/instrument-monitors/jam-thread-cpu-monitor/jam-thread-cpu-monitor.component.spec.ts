import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JamThreadCpuMonitorComponent } from './jam-thread-cpu-monitor.component';

describe('JamThreadCpuMonitorComponent', () => {
  let component: JamThreadCpuMonitorComponent;
  let fixture: ComponentFixture<JamThreadCpuMonitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JamThreadCpuMonitorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JamThreadCpuMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
