import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCustomMonitorComponent } from './add-custom-monitor.component';

describe('AddCustomMonitorComponent', () => {
  let component: AddCustomMonitorComponent;
  let fixture: ComponentFixture<AddCustomMonitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCustomMonitorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCustomMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
