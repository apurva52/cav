import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceMethodTimingComponent } from './service-method-timing.component';

describe('ServiceMethodTimingComponent', () => {
  let component: ServiceMethodTimingComponent;
  let fixture: ComponentFixture<ServiceMethodTimingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceMethodTimingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceMethodTimingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
