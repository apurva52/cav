import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsMenuComponent } from './events-menu.component';

describe('EventsMenuComponent', () => {
  let component: EventsMenuComponent;
  let fixture: ComponentFixture<EventsMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventsMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
