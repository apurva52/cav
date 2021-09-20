import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorUpDownStatusComponent } from './monitor-up-down-status.component';

describe('MonitorUpDownStatusComponent', () => {
  let component: MonitorUpDownStatusComponent;
  let fixture: ComponentFixture<MonitorUpDownStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitorUpDownStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitorUpDownStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
