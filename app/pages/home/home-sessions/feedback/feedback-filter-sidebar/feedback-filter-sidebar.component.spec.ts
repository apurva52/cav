import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackFilterSidebarComponent } from './feedback-filter-sidebar.component';

describe('FeedbackFilterSidebarComponent', () => {
  let component: FeedbackFilterSidebarComponent;
  let fixture: ComponentFixture<FeedbackFilterSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedbackFilterSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackFilterSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
