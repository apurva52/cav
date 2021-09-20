import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepeatedCalloutDetailsComponent } from './repeated-callout-details.component';

describe('RepeatedCalloutDetailsComponent', () => {
  let component: RepeatedCalloutDetailsComponent;
  let fixture: ComponentFixture<RepeatedCalloutDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepeatedCalloutDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepeatedCalloutDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
