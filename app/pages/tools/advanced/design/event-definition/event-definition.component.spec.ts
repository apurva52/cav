import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventDefinitionComponent } from './event-definition.component';

describe('EventDefinitionComponent', () => {
  let component: EventDefinitionComponent;
  let fixture: ComponentFixture<EventDefinitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventDefinitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
