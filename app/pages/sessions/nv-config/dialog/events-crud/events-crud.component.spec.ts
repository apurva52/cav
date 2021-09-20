import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsCrudComponent } from './events-crud.component';

describe('EventsCrudComponent', () => {
  let component: EventsCrudComponent;
  let fixture: ComponentFixture<EventsCrudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventsCrudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
