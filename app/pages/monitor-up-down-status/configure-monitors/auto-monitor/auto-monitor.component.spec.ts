import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoMonitorComponent } from './auto-monitor.component';

describe('AutoMonitorComponent', () => {
  let component: AutoMonitorComponent;
  let fixture: ComponentFixture<AutoMonitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoMonitorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
