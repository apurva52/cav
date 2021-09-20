import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RunningMonitorsComponent } from './running-monitors.component';

describe('RunningMonitorsComponent', () => {
  let component: RunningMonitorsComponent;
  let fixture: ComponentFixture<RunningMonitorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RunningMonitorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunningMonitorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
