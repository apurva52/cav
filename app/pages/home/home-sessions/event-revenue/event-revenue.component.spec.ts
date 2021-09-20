import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventRevenueComponent } from './event-revenue.component';

describe('EventRevenueComponent', () => {
  let component: EventRevenueComponent;
  let fixture: ComponentFixture<EventRevenueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventRevenueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventRevenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
