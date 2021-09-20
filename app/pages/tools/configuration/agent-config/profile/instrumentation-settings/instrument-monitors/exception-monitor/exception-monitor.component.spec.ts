import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExceptionMonitorComponent } from './exception-monitor.component';

describe('ExceptionMonitorComponent', () => {
  let component: ExceptionMonitorComponent;
  let fixture: ComponentFixture<ExceptionMonitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExceptionMonitorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExceptionMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
