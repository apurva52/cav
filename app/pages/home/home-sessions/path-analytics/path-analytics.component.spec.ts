import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PathAnalyticsComponent } from './path-analytics.component';

describe('PathAnalyticsComponent', () => {
  let component: PathAnalyticsComponent;
  let fixture: ComponentFixture<PathAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PathAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PathAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
