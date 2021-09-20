import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventAggFilterSidebarComponent } from './eventagg-filter-sidebar.component';

describe('HttpFilterSidebarComponent', () => {
  let component: EventAggFilterSidebarComponent;
  let fixture: ComponentFixture<EventAggFilterSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventAggFilterSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventAggFilterSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
